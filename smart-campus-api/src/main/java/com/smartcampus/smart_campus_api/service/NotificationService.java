package com.smartcampus.smart_campus_api.service;

import com.smartcampus.smart_campus_api.dto.CreateNotificationRequest;
import com.smartcampus.smart_campus_api.dto.NotificationDTO;
import com.smartcampus.smart_campus_api.entity.AdminNotification;
import com.smartcampus.smart_campus_api.entity.User;
import com.smartcampus.smart_campus_api.entity.UserNotification;
import com.smartcampus.smart_campus_api.enums.NotificationStatus;
import com.smartcampus.smart_campus_api.enums.TargetAudienceType;
import com.smartcampus.smart_campus_api.repository.AdminNotificationRepository;
import com.smartcampus.smart_campus_api.repository.UserNotificationRepository;
import com.smartcampus.smart_campus_api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private AdminNotificationRepository adminNotificationRepo;

    @Autowired
    private UserNotificationRepository userNotificationRepo;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public AdminNotification createNotification(CreateNotificationRequest request, Long adminId) {
        AdminNotification notification = new AdminNotification();
        notification.setTitle(request.getTitle());
        notification.setMessage(request.getMessage());
        notification.setType(request.getType());
        notification.setPriority(request.getPriority());
        notification.setTargetAudience(request.getTargetAudience());

        Long resolvedUserId = null;
        if (request.getTargetAudience() == TargetAudienceType.SPECIFIC_USER) {
            if ("STUDENT".equalsIgnoreCase(request.getSpecificRole())) {
                resolvedUserId = userRepository.findByStudentId(request.getSpecificIdentifier()).map(User::getId).orElse(null);
            } else {
                resolvedUserId = userRepository.findByEmployeeId(request.getSpecificIdentifier()).map(User::getId).orElse(null);
            }
            if (resolvedUserId == null) {
                throw new IllegalArgumentException("User not found with the provided " + request.getSpecificRole() + " ID.");
            }
        }
        notification.setTargetUserId(resolvedUserId);

        notification.setActionUrl(request.getActionUrl());
        notification.setPinned(request.getPinned() != null ? request.getPinned() : false);
        notification.setStartDate(request.getStartDate());
        notification.setExpiryDate(request.getExpiryDate());
        notification.setCreatedBy(adminId);

        if (request.getSendImmediately() != null && request.getSendImmediately()) {
            notification.setStatus(NotificationStatus.SENT);
            notification.setSentAt(LocalDateTime.now());
        } else {
            notification.setStatus(NotificationStatus.SCHEDULED);
        }

        AdminNotification savedNotification = adminNotificationRepo.save(notification);

        // Map and distribute to users
        distributeNotification(savedNotification);

        return savedNotification;
    }

    private void distributeNotification(AdminNotification notification) {
        List<User> targetUsers = new ArrayList<>();

        if (notification.getTargetAudience() == TargetAudienceType.ALL_USERS) {
            targetUsers = userRepository.findAll();
        } else if (notification.getTargetAudience() == TargetAudienceType.ALL_STUDENTS) {
            targetUsers = userRepository.findByRole("STUDENT");
        } else if (notification.getTargetAudience() == TargetAudienceType.ALL_TECHNICIANS) {
            targetUsers = userRepository.findByRole("TECHNICIAN");
        } else if (notification.getTargetAudience() == TargetAudienceType.ALL_LECTURERS) {
            targetUsers = userRepository.findByRole("LECTURER");
        } else if (notification.getTargetAudience() == TargetAudienceType.ALL_ADMINS) {
            targetUsers = userRepository.findByRole("ADMIN");
        } else if (notification.getTargetAudience() == TargetAudienceType.SPECIFIC_USER) {
            if (notification.getTargetUserId() != null) {
                userRepository.findById(notification.getTargetUserId()).ifPresent(targetUsers::add);
            }
        }

        List<UserNotification> userNotifications = targetUsers.stream().map(user -> {
            UserNotification un = new UserNotification();
            un.setNotification(notification);
            un.setRecipientUserId(user.getId());
            return un;
        }).collect(Collectors.toList());

        userNotificationRepo.saveAll(userNotifications);
    }
    
    public List<AdminNotification> getAllAdminNotifications() {
        return adminNotificationRepo.findAll();
    }

    public List<NotificationDTO> getUserActiveNotifications(Long userId) {
        List<UserNotification> userNotifications = userNotificationRepo.findAllActiveForUser(userId);
        return userNotifications.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public Long getUnreadCount(Long userId) {
        return userNotificationRepo.countUnreadForUser(userId);
    }

    @Transactional
    public void markAsRead(Long userNotificationId, Long userId) {
        userNotificationRepo.findById(userNotificationId).ifPresent(un -> {
            if (un.getRecipientUserId().equals(userId)) {
                un.setIsRead(true);
                un.setReadAt(LocalDateTime.now());
                userNotificationRepo.save(un);
            }
        });
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        List<UserNotification> userNotifications = userNotificationRepo.findAllActiveForUser(userId);
        for(UserNotification un: userNotifications) {
             if(!un.getIsRead()) {
                 un.setIsRead(true);
                 un.setReadAt(LocalDateTime.now());
             }
        }
        userNotificationRepo.saveAll(userNotifications);
    }

    @Transactional
    public void deleteUserNotification(Long userNotificationId, Long userId) {
        userNotificationRepo.findById(userNotificationId).ifPresent(un -> {
            if (un.getRecipientUserId().equals(userId)) {
                un.setIsDeleted(true);
                userNotificationRepo.save(un);
            }
        });
    }

    @Transactional
    public void expireAdminNotification(Long adminNotificationId) {
        adminNotificationRepo.findById(adminNotificationId).ifPresent(an -> {
            an.setStatus(NotificationStatus.EXPIRED);
            an.setExpiryDate(LocalDateTime.now());
            adminNotificationRepo.save(an);
        });
    }

    @Transactional
    public void resendAdminNotification(Long adminNotificationId) {
        adminNotificationRepo.findById(adminNotificationId).ifPresent(an -> {
            // For resending, simply extend the dates and mark sent
            an.setStatus(NotificationStatus.SENT);
            an.setSentAt(LocalDateTime.now());
            an.setCreatedAt(LocalDateTime.now()); // Update created date so it sorts to top
            if (an.getExpiryDate() != null && an.getExpiryDate().isBefore(LocalDateTime.now())) {
                 an.setExpiryDate(LocalDateTime.now().plusWeeks(1));
            }
            AdminNotification savedAn = adminNotificationRepo.save(an);
            
            List<UserNotification> existingUsers = userNotificationRepo.findByNotification(savedAn);
            if (existingUsers.isEmpty()) {
                distributeNotification(savedAn);
            } else {
                for (UserNotification un : existingUsers) {
                    un.setIsRead(false);
                    un.setIsDeleted(false);
                    un.setDeliveredAt(LocalDateTime.now());
                }
                userNotificationRepo.saveAll(existingUsers);
            }
        });
    }

    private NotificationDTO mapToDTO(UserNotification un) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(un.getId());
        dto.setNotificationId(un.getNotification().getId());
        dto.setTitle(un.getNotification().getTitle());
        dto.setMessage(un.getNotification().getMessage());
        dto.setType(un.getNotification().getType());
        dto.setPriority(un.getNotification().getPriority());
        dto.setActionUrl(un.getNotification().getActionUrl());
        dto.setPinned(un.getNotification().getPinned());
        dto.setCreatedAt(un.getNotification().getCreatedAt());
        dto.setIsRead(un.getIsRead());
        return dto;
    }
}

package com.smartcampus.smart_campus_api.controller;

import com.smartcampus.smart_campus_api.dto.NotificationDTO;
import com.smartcampus.smart_campus_api.entity.User;
import com.smartcampus.smart_campus_api.service.NotificationService;
import com.smartcampus.smart_campus_api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserNotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<?> getNotifications(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        User user = userService.getUserByEmail(authentication.getName());
        if (user == null) {
             return ResponseEntity.status(404).body("User not found");
        }

        List<NotificationDTO> dtos = notificationService.getUserActiveNotifications(user.getId());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        User user = userService.getUserByEmail(authentication.getName());
        if (user == null) {
             return ResponseEntity.status(404).body("User not found");
        }

        Long count = notificationService.getUnreadCount(user.getId());
        return ResponseEntity.ok(count);
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(Authentication authentication, @PathVariable Long id) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        User user = userService.getUserByEmail(authentication.getName());
        if (user == null) {
             return ResponseEntity.status(404).body("User not found");
        }

        notificationService.markAsRead(id, user.getId());
        return ResponseEntity.ok("Marked read");
    }

    @PatchMapping("/mark-all-read")
    public ResponseEntity<?> markAllAsRead(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        User user = userService.getUserByEmail(authentication.getName());
        if (user == null) {
             return ResponseEntity.status(404).body("User not found");
        }

        notificationService.markAllAsRead(user.getId());
        return ResponseEntity.ok("Marked all read");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(Authentication authentication, @PathVariable Long id) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        User user = userService.getUserByEmail(authentication.getName());
        if (user == null) {
             return ResponseEntity.status(404).body("User not found");
        }

        notificationService.deleteUserNotification(id, user.getId());
        return ResponseEntity.ok("Deleted");
    }
}

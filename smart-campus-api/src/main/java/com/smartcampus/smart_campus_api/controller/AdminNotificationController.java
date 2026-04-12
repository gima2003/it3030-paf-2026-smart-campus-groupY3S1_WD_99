package com.smartcampus.smart_campus_api.controller;

import com.smartcampus.smart_campus_api.dto.CreateNotificationRequest;
import com.smartcampus.smart_campus_api.entity.AdminNotification;
import com.smartcampus.smart_campus_api.entity.User;
import com.smartcampus.smart_campus_api.service.NotificationService;
import com.smartcampus.smart_campus_api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/notifications")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminNotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> createNotification(Authentication authentication, @RequestBody CreateNotificationRequest request) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        User admin = userService.getUserByEmail(authentication.getName());
        if (admin == null || !admin.getRole().equals("ADMIN")) {
            return ResponseEntity.status(403).body("Forbidden");
        }
        
        AdminNotification saved = notificationService.createNotification(request, admin.getId());
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<?> getAllNotifications(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        User admin = userService.getUserByEmail(authentication.getName());
        if (admin == null || !admin.getRole().equals("ADMIN")) {
            return ResponseEntity.status(403).body("Forbidden");
        }
        
        List<AdminNotification> notifications = notificationService.getAllAdminNotifications();
        return ResponseEntity.ok(notifications);
    }

    @PatchMapping("/{id}/expire")
    public ResponseEntity<?> expireNotification(Authentication authentication, @PathVariable Long id) {
        if (authentication == null || authentication.getName() == null) {
             return ResponseEntity.status(401).body("Unauthorized");
        }
        User admin = userService.getUserByEmail(authentication.getName());
        if (admin == null || !admin.getRole().equals("ADMIN")) {
            return ResponseEntity.status(403).body("Forbidden");
        }
        
        notificationService.expireAdminNotification(id);
        return ResponseEntity.ok("Expired");
    }

    @PostMapping("/{id}/resend")
    public ResponseEntity<?> resendNotification(Authentication authentication, @PathVariable Long id) {
        if (authentication == null || authentication.getName() == null) {
             return ResponseEntity.status(401).body("Unauthorized");
        }
        User admin = userService.getUserByEmail(authentication.getName());
        if (admin == null || !admin.getRole().equals("ADMIN")) {
            return ResponseEntity.status(403).body("Forbidden");
        }
        
        notificationService.resendAdminNotification(id);
        return ResponseEntity.ok("Resent");
    }
}

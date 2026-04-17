package com.smartcampus.smart_campus_api.controller;

import com.smartcampus.smart_campus_api.dto.UpdateProfileRequest;
import com.smartcampus.smart_campus_api.entity.User;
import com.smartcampus.smart_campus_api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {

    @Autowired
    private UserService userService;

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(Authentication authentication, @RequestBody UpdateProfileRequest request) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        try {
            String email = authentication.getName();
            User updatedUser = userService.updateUserProfile(email, request);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred while updating profile");
        }
    }
}

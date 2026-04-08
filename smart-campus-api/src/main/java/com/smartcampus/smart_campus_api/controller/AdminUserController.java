package com.smartcampus.smart_campus_api.controller;

import com.smartcampus.smart_campus_api.dto.CreateUserRequest;
import com.smartcampus.smart_campus_api.dto.UpdateUserAdminRequest;
import com.smartcampus.smart_campus_api.entity.User;
import com.smartcampus.smart_campus_api.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "*") // Allow frontend to call APIs
public class AdminUserController {

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> createUser(@Valid @RequestBody CreateUserRequest request) {
        try {
            User createdUser = userService.createUser(request);
            return ResponseEntity.ok(createdUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred while creating the user.");
        }
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/stats")
    public ResponseEntity<java.util.Map<String, Object>> getUserStats() {
        return ResponseEntity.ok(userService.getUserStats());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestBody java.util.Map<String, Boolean> body) {
        try {
            Boolean isActive = body.get("isActive");
            if (isActive == null) {
                return ResponseEntity.badRequest().body("isActive field is required");
            }
            User updatedUser = userService.updateUserStatus(id, isActive);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred while updating status");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok().body(java.util.Map.of("message", "User deleted successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred while deleting user");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUserByAdmin(@PathVariable Long id, @RequestBody UpdateUserAdminRequest request) {
        try {
            User updatedUser = userService.updateUserByAdmin(id, request);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred while updating user");
        }
    }
}

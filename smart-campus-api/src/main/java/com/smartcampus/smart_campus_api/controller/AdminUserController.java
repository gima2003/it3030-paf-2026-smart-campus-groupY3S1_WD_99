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
@CrossOrigin(origins = "*")
public class AdminUserController {

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> createUser(@Valid @RequestBody CreateUserRequest request) {
        try {
            User createdUser = userService.createUser(request);
            return ResponseEntity.status(201).body(createdUser); 
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage()); 
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An error occurred while creating the user.");
        }
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.status(200).body(users); 
    }

    @GetMapping("/stats")
    public ResponseEntity<java.util.Map<String, Object>> getUserStats() {
        return ResponseEntity.status(200).body(userService.getUserStats()); 
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id,
    @RequestBody java.util.Map<String, Boolean> body) {
        try {
            Boolean isActive = body.get("isActive");
            if (isActive == null) {
                return ResponseEntity.status(400).body("isActive field is required");
            }

            User updatedUser = userService.updateUserStatus(id, isActive);
            return ResponseEntity.status(200).body(updatedUser);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An error occurred while updating status");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.status(200)
                    .body(java.util.Map.of("message", "User deleted successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An error occurred while deleting user");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUserByAdmin(@PathVariable Long id,
      @RequestBody UpdateUserAdminRequest request) {
        try {
            User updatedUser = userService.updateUserByAdmin(id, request);
            return ResponseEntity.status(200).body(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An error occurred while updating user");
        }
    }
}
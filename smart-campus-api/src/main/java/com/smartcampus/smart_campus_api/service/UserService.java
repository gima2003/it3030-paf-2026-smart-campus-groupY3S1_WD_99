package com.smartcampus.smart_campus_api.service;

import com.smartcampus.smart_campus_api.dto.CreateUserRequest;
import com.smartcampus.smart_campus_api.dto.UpdateProfileRequest;
import com.smartcampus.smart_campus_api.dto.UpdateUserAdminRequest;
import com.smartcampus.smart_campus_api.entity.User;
import com.smartcampus.smart_campus_api.enums.Role;
import com.smartcampus.smart_campus_api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    public User createUser(CreateUserRequest request) {
        // 1. Initial Email Check
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }

        // 2. Validate Role-Specific Fields
        validateRoleFields(request);

        // 3. Map DTO to Entity
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setCity(request.getCity());
        user.setRole(request.getRole());
        user.setIsActive(request.getIsActive());

        // Set Role-Specific Fields based on Role
        Role roleEnum;
        try {
            roleEnum = Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role provided");
        }

        switch (roleEnum) {
            case STUDENT:
                user.setStudentId(request.getStudentId());
                user.setDepartment(request.getDepartment());
                user.setBatchYear(request.getBatchYear());
                user.setFaculty(request.getFaculty());
                break;
            case LECTURER:
                user.setEmployeeId(request.getEmployeeId());
                user.setDepartment(request.getDepartment());
                user.setDesignation(request.getDesignation());
                user.setSpecialization(request.getSpecialization());
                break;
            case MANAGER:
                user.setEmployeeId(request.getEmployeeId());
                user.setDepartment(request.getDepartment());
                user.setOfficeLocation(request.getOfficeLocation());
                break;
            case TECHNICIAN:
                user.setEmployeeId(request.getEmployeeId());
                user.setDepartment(request.getDepartment());
                user.setSpecialization(request.getSpecialization());
                break;
            case ADMIN:
                // No role-specific fields for ADMIN
                break;
        }

        User savedUser = userRepository.save(user);

        // Send email if user is active
        if (Boolean.TRUE.equals(savedUser.getIsActive())) {
            emailService.sendWelcomeEmail(savedUser.getEmail(), savedUser.getFirstName(), savedUser.getRole());
        }

        return savedUser;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public java.util.Map<String, Object> getUserStats() {
        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("totalStudents", userRepository.countByRole("STUDENT"));
        stats.put("totalLecturers", userRepository.countByRole("LECTURER"));
        stats.put("totalTechnicians", userRepository.countByRole("TECHNICIAN"));
        stats.put("totalActive", userRepository.countByIsActive(true));
        stats.put("totalInactive", userRepository.countByIsActive(false));
        return stats;
    }

    public User updateUserStatus(Long id, boolean isActive) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
        user.setIsActive(isActive);
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
        userRepository.delete(user);
    }

    public User updateUserProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getCity() != null) user.setCity(request.getCity());

        Role roleEnum = Role.valueOf(user.getRole().toUpperCase());
        switch (roleEnum) {
            case STUDENT:
                if (request.getBatchYear() != null) user.setBatchYear(request.getBatchYear());
                break;
            case LECTURER:
                if (request.getSpecialization() != null) user.setSpecialization(request.getSpecialization());
                if (request.getDesignation() != null) user.setDesignation(request.getDesignation());
                break;
            case TECHNICIAN:
                if (request.getSpecialization() != null) user.setSpecialization(request.getSpecialization());
                break;
            case MANAGER:
                if (request.getOfficeLocation() != null) user.setOfficeLocation(request.getOfficeLocation());
                break;
            case ADMIN:
                break;
        }

        return userRepository.save(user);
    }

    public User updateUserByAdmin(Long id, UpdateUserAdminRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getCity() != null) user.setCity(request.getCity());
        if (request.getIsActive() != null) user.setIsActive(request.getIsActive());

        Role roleEnum = Role.valueOf(user.getRole().toUpperCase());
        switch (roleEnum) {
            case STUDENT:
                if (request.getBatchYear() != null) user.setBatchYear(request.getBatchYear());
                if (request.getFaculty() != null) user.setFaculty(request.getFaculty());
                if (request.getDepartment() != null) user.setDepartment(request.getDepartment());
                break;
            case LECTURER:
                if (request.getDepartment() != null) user.setDepartment(request.getDepartment());
                if (request.getDesignation() != null) user.setDesignation(request.getDesignation());
                if (request.getSpecialization() != null) user.setSpecialization(request.getSpecialization());
                break;
            case TECHNICIAN:
                if (request.getDepartment() != null) user.setDepartment(request.getDepartment());
                if (request.getSpecialization() != null) user.setSpecialization(request.getSpecialization());
                break;
            case MANAGER:
                if (request.getDepartment() != null) user.setDepartment(request.getDepartment());
                if (request.getOfficeLocation() != null) user.setOfficeLocation(request.getOfficeLocation());
                break;
            case ADMIN:
                break;
        }

        return userRepository.save(user);
    }

    private void validateRoleFields(CreateUserRequest request) {
        Role roleEnum;
        try {
            roleEnum = Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role provided");
        }

        switch (roleEnum) {
            case STUDENT:
                if (request.getStudentId() == null || request.getStudentId().isEmpty())
                    throw new IllegalArgumentException("Student ID is required for STUDENT");
                if (request.getDepartment() == null)
                    throw new IllegalArgumentException("Department is required for STUDENT");
                if (request.getBatchYear() == null)
                    throw new IllegalArgumentException("Batch Year is required for STUDENT");
                if (request.getFaculty() == null)
                    throw new IllegalArgumentException("Faculty is required for STUDENT");
                break;
            case LECTURER:
                if (request.getEmployeeId() == null || request.getEmployeeId().isEmpty())
                    throw new IllegalArgumentException("Employee ID is required for LECTURER");
                if (request.getDepartment() == null)
                    throw new IllegalArgumentException("Department is required for LECTURER");
                if (request.getDesignation() == null)
                    throw new IllegalArgumentException("Designation is required for LECTURER");
                if (request.getSpecialization() == null || request.getSpecialization().isEmpty())
                    throw new IllegalArgumentException("Specialization is required for LECTURER");
                break;
            case MANAGER:
                if (request.getEmployeeId() == null || request.getEmployeeId().isEmpty())
                    throw new IllegalArgumentException("Employee ID is required for MANAGER");
                if (request.getDepartment() == null)
                    throw new IllegalArgumentException("Department is required for MANAGER");
                if (request.getOfficeLocation() == null || request.getOfficeLocation().isEmpty())
                    throw new IllegalArgumentException("Office Location is required for MANAGER");
                break;
            case TECHNICIAN:
                if (request.getEmployeeId() == null || request.getEmployeeId().isEmpty())
                    throw new IllegalArgumentException("Employee ID is required for TECHNICIAN");
                if (request.getDepartment() == null)
                    throw new IllegalArgumentException("Department is required for TECHNICIAN");
                if (request.getSpecialization() == null || request.getSpecialization().isEmpty())
                    throw new IllegalArgumentException("Specialization is required for TECHNICIAN");
                break;
            case ADMIN:
                // No role-specific validation for ADMIN
                break;
        }
    }
}

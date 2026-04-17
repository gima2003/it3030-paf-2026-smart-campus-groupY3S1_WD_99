package com.smartcampus.smart_campus_api.dto;

import com.smartcampus.smart_campus_api.enums.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateUserRequest {

    // Common fields
    @NotBlank(message = "First name is required")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Phone is required")
    private String phone;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "Role is required (STUDENT, LECTURER, MANAGER, TECHNICIAN, ADMIN)")
    private String role;

    @NotNull(message = "isActive is required")
    private Boolean isActive;

    // Role-specific fields (Nullable, validated conditionally in Service/Validator)
    
    // STUDENT
    private String studentId;
    private BatchYear batchYear;
    private Faculty faculty;

    // LECTURER, MANAGER, TECHNICIAN, ADMIN shared
    private String employeeId;

    // STUDENT, LECTURER, MANAGER, TECHNICIAN shared
    private Department department;

    // LECTURER, TECHNICIAN
    private String specialization;

    // LECTURER
    private Designation designation;

    // MANAGER
    private String officeLocation;

    // ADMIN
    // (No specific fields left since AccessLevel was removed)
}

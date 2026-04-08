package com.smartcampus.smart_campus_api.entity;

import jakarta.persistence.*;
import com.smartcampus.smart_campus_api.enums.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    @com.fasterxml.jackson.annotation.JsonProperty(access = com.fasterxml.jackson.annotation.JsonProperty.Access.WRITE_ONLY)
    private String password;
    private String role; // ADMIN, STUDENT, LECTURER, MANAGER, TECHNICIAN

    @Column(name = "first_name")
    private String firstName;
    
    @Column(name = "last_name")
    private String lastName;
    
    private String phone;
    private String city;
    
    @Column(name = "is_active")
    private Boolean isActive = true;

    // ----- Student Specific Fields -----
    @Column(name = "student_id")
    private String studentId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "batch_year")
    private BatchYear batchYear;
    
    @Enumerated(EnumType.STRING)
    private Faculty faculty;

    // ----- Employee Specific Field (Lecturer, Manager, Technician, Admin) -----
    @Column(name = "employee_id")
    private String employeeId;

    // ----- Shared Department Field -----
    @Enumerated(EnumType.STRING)
    private Department department;

    // ----- Lecturer / Technician Specific Fields -----
    private String specialization;

    // ----- Lecturer Specific Fields -----
    @Enumerated(EnumType.STRING)
    private Designation designation;

    // ----- Manager Specific Fields -----
    @Column(name = "office_location")
    private String officeLocation;


    public User() {}

    public User(String email, String password, String role) {
        this.email = email;
        this.password = password;
        this.role = role;
    }

    // Getters and Setters
    public Long getId() { return id; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public BatchYear getBatchYear() { return batchYear; }
    public void setBatchYear(BatchYear batchYear) { this.batchYear = batchYear; }

    public Faculty getFaculty() { return faculty; }
    public void setFaculty(Faculty faculty) { this.faculty = faculty; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public Designation getDesignation() { return designation; }
    public void setDesignation(Designation designation) { this.designation = designation; }

    public String getOfficeLocation() { return officeLocation; }
    public void setOfficeLocation(String officeLocation) { this.officeLocation = officeLocation; }
}
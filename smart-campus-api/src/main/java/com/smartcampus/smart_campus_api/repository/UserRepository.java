package com.smartcampus.smart_campus_api.repository;

import com.smartcampus.smart_campus_api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    java.util.List<User> findByRole(String role);
    Optional<User> findByStudentId(String studentId);
    Optional<User> findByEmployeeId(String employeeId);

    long countByRole(String role);
    long countByIsActive(Boolean isActive);
}
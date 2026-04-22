package com.smartcampus.smart_campus_api.repository;

import com.smartcampus.smart_campus_api.entity.Technician;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TechnicianRepository extends JpaRepository<Technician, Long> {

    List<Technician> findBySpecialization(String specialization);

    List<Technician> findByStatus(String status);

    Optional<Technician> findByEmail(String email);

    boolean existsByEmail(String email);
}
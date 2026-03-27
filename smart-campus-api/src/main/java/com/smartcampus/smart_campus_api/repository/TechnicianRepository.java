package com.smartcampus.smart_campus_api.repository;


import com.smartcampus.smart_campus_api.entity.Technician;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface TechnicianRepository extends JpaRepository<Technician, Long> {

    List<Technician> findBySpecialization(String specialization);

    List<Technician> findByStatus(String status);
}


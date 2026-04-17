package com.smartcampus.smart_campus_api.service;


import com.smartcampus.smart_campus_api.entity.Technician;
import com.smartcampus.smart_campus_api.repository.TechnicianRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TechnicianService {

    @Autowired
    private TechnicianRepository technicianRepository;

    public Technician createTechnician(Technician technician) {
        return technicianRepository.save(technician);
    }

    public List<Technician> getAllTechnicians() {
        return technicianRepository.findAll();
    }

    public Technician getTechnicianById(Long id) {
        return technicianRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Technician not found with id: " + id));
    }

    public Technician updateTechnician(Long id, Technician updatedTechnician) {
        Technician technician = technicianRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Technician not found with id: " + id));

        technician.setFullName(updatedTechnician.getFullName());
        technician.setEmail(updatedTechnician.getEmail());
        technician.setPhone(updatedTechnician.getPhone());
        technician.setSpecialization(updatedTechnician.getSpecialization());
        technician.setStatus(updatedTechnician.getStatus());

        return technicianRepository.save(technician);
    }

    public void deleteTechnician(Long id) {
        technicianRepository.deleteById(id);
    }

    public List<Technician> getTechniciansBySpecialization(String specialization) {
        return technicianRepository.findBySpecialization(specialization);
    }

    public List<Technician> getTechniciansByStatus(String status) {
        return technicianRepository.findByStatus(status);
    }
}
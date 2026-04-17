package com.smartcampus.smart_campus_api.controller;


import com.smartcampus.smart_campus_api.entity.Technician;
import com.smartcampus.smart_campus_api.service.TechnicianService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/technicians")
@CrossOrigin(origins = "http://localhost:5173")
public class TechnicianController {

    @Autowired
    private TechnicianService technicianService;

    @PostMapping
    public Technician createTechnician(@RequestBody Technician technician) {
        return technicianService.createTechnician(technician);
    }

    @GetMapping
    public List<Technician> getAllTechnicians() {
        return technicianService.getAllTechnicians();
    }

    @GetMapping("/{id}")
    public Technician getTechnicianById(@PathVariable Long id) {
        return technicianService.getTechnicianById(id);
    }

    @PutMapping("/{id}")
    public Technician updateTechnician(@PathVariable Long id, @RequestBody Technician technician) {
        return technicianService.updateTechnician(id, technician);
    }

    @DeleteMapping("/{id}")
    public void deleteTechnician(@PathVariable Long id) {
        technicianService.deleteTechnician(id);
    }

    @GetMapping("/specialization/{specialization}")
    public List<Technician> getTechniciansBySpecialization(@PathVariable String specialization) {
        return technicianService.getTechniciansBySpecialization(specialization);
    }

    @GetMapping("/status/{status}")
    public List<Technician> getTechniciansByStatus(@PathVariable String status) {
        return technicianService.getTechniciansByStatus(status);
    }
}

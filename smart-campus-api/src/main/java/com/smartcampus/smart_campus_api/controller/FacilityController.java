package com.smartcampus.smart_campus_api.controller;

import com.smartcampus.smart_campus_api.dto.FacilityRequestDto;
import com.smartcampus.smart_campus_api.dto.FacilityResponseDto;
import com.smartcampus.smart_campus_api.service.FacilityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/facilities")
@CrossOrigin(origins = "*")
public class FacilityController {

    private final FacilityService facilityService;

    public FacilityController(FacilityService facilityService) {
        this.facilityService = facilityService;
    }

    // ✅ CREATE
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FacilityResponseDto> createFacility(@RequestBody FacilityRequestDto requestDto) {
        FacilityResponseDto response = facilityService.createFacility(requestDto);
        return ResponseEntity.status(201).body(response); // 🔹 201 CREATED
    }

    // ✅ GET ALL
    @GetMapping
    public ResponseEntity<List<FacilityResponseDto>> getAllFacilities() {
        List<FacilityResponseDto> facilities = facilityService.getAllFacilities();
        return ResponseEntity.ok(facilities); // 🔹 200 OK
    }

    // ✅ GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<FacilityResponseDto> getFacilityById(@PathVariable Long id) {
        FacilityResponseDto facility = facilityService.getFacilityById(id);
        if (facility == null) {
            return ResponseEntity.status(404).build(); // 🔹 404 NOT FOUND
        }
        return ResponseEntity.ok(facility); // 🔹 200 OK
    }

    // ✅ UPDATE
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FacilityResponseDto> updateFacility(@PathVariable Long id,
                                                              @RequestBody FacilityRequestDto requestDto) {
        FacilityResponseDto updatedFacility = facilityService.updateFacility(id, requestDto);
        return ResponseEntity.ok(updatedFacility); // 🔹 200 OK
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteFacility(@PathVariable Long id) {
        facilityService.deleteFacility(id);
        return ResponseEntity.noContent().build(); // 🔹 204 NO CONTENT
    }
}
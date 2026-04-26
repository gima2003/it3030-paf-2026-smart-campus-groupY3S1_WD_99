package com.smartcampus.smart_campus_api.controller;

import com.smartcampus.smart_campus_api.dto.FacilityRequestDto;
import com.smartcampus.smart_campus_api.dto.FacilityResponseDto;
import com.smartcampus.smart_campus_api.service.FacilityService;
import org.springframework.http.HttpStatus;
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

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FacilityResponseDto> createFacility(@RequestBody FacilityRequestDto requestDto) {
        FacilityResponseDto response = facilityService.createFacility(requestDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<FacilityResponseDto>> getAllFacilities() {
        List<FacilityResponseDto> facilities = facilityService.getAllFacilities();
        return ResponseEntity.ok(facilities);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FacilityResponseDto> getFacilityById(@PathVariable Long id) {
        FacilityResponseDto facility = facilityService.getFacilityById(id);
        return ResponseEntity.ok(facility);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FacilityResponseDto> updateFacility(@PathVariable Long id,
                                                              @RequestBody FacilityRequestDto requestDto) {
        FacilityResponseDto updatedFacility = facilityService.updateFacility(id, requestDto);
        return ResponseEntity.ok(updatedFacility);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteFacility(@PathVariable Long id) {
        facilityService.deleteFacility(id);
        return ResponseEntity.ok("Facility deleted successfully");
    }
}
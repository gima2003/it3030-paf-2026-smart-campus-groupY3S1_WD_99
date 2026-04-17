package com.smartcampus.smart_campus_api.controller;

import com.smartcampus.smart_campus_api.dto.EquipmentRequestDto;
import com.smartcampus.smart_campus_api.dto.EquipmentResponseDto;
import com.smartcampus.smart_campus_api.service.EquipmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipment")
@CrossOrigin(origins = "*")
public class EquipmentController {

    private final EquipmentService equipmentService;

    public EquipmentController(EquipmentService equipmentService) {
        this.equipmentService = equipmentService;
    }

    @PostMapping
    public ResponseEntity<EquipmentResponseDto> createEquipment(@RequestBody EquipmentRequestDto requestDto) {
        EquipmentResponseDto response = equipmentService.createEquipment(requestDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<EquipmentResponseDto>> getAllEquipment() {
        List<EquipmentResponseDto> equipmentList = equipmentService.getAllEquipment();
        return ResponseEntity.ok(equipmentList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EquipmentResponseDto> getEquipmentById(@PathVariable Long id) {
        EquipmentResponseDto equipment = equipmentService.getEquipmentById(id);
        return ResponseEntity.ok(equipment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EquipmentResponseDto> updateEquipment(@PathVariable Long id,
                                                                @RequestBody EquipmentRequestDto requestDto) {
        EquipmentResponseDto updatedEquipment = equipmentService.updateEquipment(id, requestDto);
        return ResponseEntity.ok(updatedEquipment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEquipment(@PathVariable Long id) {
        equipmentService.deleteEquipment(id);
        return ResponseEntity.ok("Equipment deleted successfully");
    }
}
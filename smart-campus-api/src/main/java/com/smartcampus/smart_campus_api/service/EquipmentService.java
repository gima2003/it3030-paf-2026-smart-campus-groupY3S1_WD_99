package com.smartcampus.smart_campus_api.service;

import com.smartcampus.smart_campus_api.dto.EquipmentRequestDto;
import com.smartcampus.smart_campus_api.dto.EquipmentResponseDto;

import java.util.List;

public interface EquipmentService {

    EquipmentResponseDto createEquipment(EquipmentRequestDto requestDto);

    List<EquipmentResponseDto> getAllEquipment();

    EquipmentResponseDto getEquipmentById(Long id);

    EquipmentResponseDto updateEquipment(Long id, EquipmentRequestDto requestDto);

    void deleteEquipment(Long id);
}
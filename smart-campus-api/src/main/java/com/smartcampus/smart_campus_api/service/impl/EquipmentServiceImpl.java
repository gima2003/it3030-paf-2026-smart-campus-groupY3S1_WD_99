package com.smartcampus.smart_campus_api.service.impl;

import com.smartcampus.smart_campus_api.dto.EquipmentRequestDto;
import com.smartcampus.smart_campus_api.dto.EquipmentResponseDto;
import com.smartcampus.smart_campus_api.entity.Equipment;
import com.smartcampus.smart_campus_api.entity.Facility;
import com.smartcampus.smart_campus_api.repository.EquipmentRepository;
import com.smartcampus.smart_campus_api.repository.FacilityRepository;
import com.smartcampus.smart_campus_api.service.EquipmentService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class EquipmentServiceImpl implements EquipmentService {

    private final EquipmentRepository equipmentRepository;
    private final FacilityRepository facilityRepository;

    public EquipmentServiceImpl(EquipmentRepository equipmentRepository,
                                FacilityRepository facilityRepository) {
        this.equipmentRepository = equipmentRepository;
        this.facilityRepository = facilityRepository;
    }

    @Override
    public EquipmentResponseDto createEquipment(EquipmentRequestDto requestDto) {
        Equipment equipment = new Equipment();
        mapEquipmentRequestToEntity(requestDto, equipment);
        Equipment savedEquipment = equipmentRepository.save(equipment);
        return mapEquipmentToResponseDto(savedEquipment);
    }

    @Override
    public List<EquipmentResponseDto> getAllEquipment() {
        List<Equipment> equipmentList = equipmentRepository.findAll();
        List<EquipmentResponseDto> responseList = new ArrayList<>();

        for (Equipment equipment : equipmentList) {
            responseList.add(mapEquipmentToResponseDto(equipment));
        }

        return responseList;
    }

    @Override
    public EquipmentResponseDto getEquipmentById(Long id) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipment not found with id: " + id));

        return mapEquipmentToResponseDto(equipment);
    }

    @Override
    public EquipmentResponseDto updateEquipment(Long id, EquipmentRequestDto requestDto) {
        Equipment existingEquipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipment not found with id: " + id));

        mapEquipmentRequestToEntity(requestDto, existingEquipment);
        Equipment updatedEquipment = equipmentRepository.save(existingEquipment);

        return mapEquipmentToResponseDto(updatedEquipment);
    }

    @Override
    public void deleteEquipment(Long id) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipment not found with id: " + id));

        equipmentRepository.delete(equipment);
    }

    private void mapEquipmentRequestToEntity(EquipmentRequestDto requestDto, Equipment equipment) {
        equipment.setName(requestDto.getName());

        // DTO field "code" -> entity field "equipmentCode"
        equipment.setEquipmentCode(requestDto.getCode());

        equipment.setDescription(requestDto.getDescription());
        equipment.setEquipmentType(requestDto.getEquipmentType());
        equipment.setQuantity(requestDto.getQuantity());
        equipment.setStatus(requestDto.getStatus());
        equipment.setCurrentLocation(requestDto.getCurrentLocation());

        // DTO field "active" -> entity field "isBookable"
        equipment.setIsBookable(requestDto.getActive() != null ? requestDto.getActive() : true);

        // entity relationship field = facilities
        if (requestDto.getFacilityIds() != null) {
            List<Facility> facilityList = facilityRepository.findAllById(requestDto.getFacilityIds());
            Set<Facility> facilitySet = new HashSet<>(facilityList);
            equipment.setFacilities(facilitySet);
        } else {
            equipment.setFacilities(new HashSet<>());
        }
    }

    private EquipmentResponseDto mapEquipmentToResponseDto(Equipment equipment) {
        EquipmentResponseDto dto = new EquipmentResponseDto();

        dto.setId(equipment.getId());
        dto.setName(equipment.getName());

        // entity field "equipmentCode" -> DTO field "code"
        dto.setCode(equipment.getEquipmentCode());

        dto.setDescription(equipment.getDescription());
        dto.setEquipmentType(equipment.getEquipmentType());
        dto.setQuantity(equipment.getQuantity());
        dto.setStatus(equipment.getStatus());
        dto.setCurrentLocation(equipment.getCurrentLocation());

        // entity field "isBookable" -> DTO field "active"
        dto.setActive(equipment.getIsBookable());

        List<Long> facilityIds = new ArrayList<>();
        List<String> facilityNames = new ArrayList<>();

        if (equipment.getFacilities() != null) {
            for (Facility facility : equipment.getFacilities()) {
                facilityIds.add(facility.getId());
                facilityNames.add(facility.getName());
            }
        }

        dto.setFacilityIds(facilityIds);
        dto.setFacilityNames(facilityNames);

        return dto;
    }
}
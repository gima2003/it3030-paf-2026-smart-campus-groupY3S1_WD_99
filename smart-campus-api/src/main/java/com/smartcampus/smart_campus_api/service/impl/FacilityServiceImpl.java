package com.smartcampus.smart_campus_api.service.impl;

import com.smartcampus.smart_campus_api.dto.FacilityRequestDto;
import com.smartcampus.smart_campus_api.dto.FacilityResponseDto;
import com.smartcampus.smart_campus_api.entity.Equipment;
import com.smartcampus.smart_campus_api.entity.Facility;
import com.smartcampus.smart_campus_api.repository.EquipmentRepository;
import com.smartcampus.smart_campus_api.repository.FacilityRepository;
import com.smartcampus.smart_campus_api.service.FacilityService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class FacilityServiceImpl implements FacilityService {

    private final FacilityRepository facilityRepository;
    private final EquipmentRepository equipmentRepository;

    public FacilityServiceImpl(FacilityRepository facilityRepository,
                               EquipmentRepository equipmentRepository) {
        this.facilityRepository = facilityRepository;
        this.equipmentRepository = equipmentRepository;
    }

    @Override
    public FacilityResponseDto createFacility(FacilityRequestDto requestDto) {
        Facility facility = new Facility();
        mapFacilityRequestToEntity(requestDto, facility);
        Facility savedFacility = facilityRepository.save(facility);
        return mapFacilityToResponseDto(savedFacility);
    }

    @Override
    public List<FacilityResponseDto> getAllFacilities() {
        List<Facility> facilities = facilityRepository.findAll();
        List<FacilityResponseDto> responseList = new ArrayList<>();

        for (Facility facility : facilities) {
            responseList.add(mapFacilityToResponseDto(facility));
        }

        return responseList;
    }

    @Override
    public FacilityResponseDto getFacilityById(Long id) {
        Facility facility = facilityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facility not found with id: " + id));

        return mapFacilityToResponseDto(facility);
    }

    @Override
    public FacilityResponseDto updateFacility(Long id, FacilityRequestDto requestDto) {
        Facility existingFacility = facilityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facility not found with id: " + id));

        mapFacilityRequestToEntity(requestDto, existingFacility);
        Facility updatedFacility = facilityRepository.save(existingFacility);

        return mapFacilityToResponseDto(updatedFacility);
    }

    @Override
    public void deleteFacility(Long id) {
        Facility facility = facilityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facility not found with id: " + id));

        facilityRepository.delete(facility);
    }

    private void mapFacilityRequestToEntity(FacilityRequestDto requestDto, Facility facility) {
        facility.setName(requestDto.getName());

        // DTO field "code" -> entity field "facilityCode"
        facility.setFacilityCode(requestDto.getCode());

        facility.setDescription(requestDto.getDescription());
        facility.setFacilityType(requestDto.getFacilityType());
        facility.setBuilding(requestDto.getBuilding());
        facility.setCapacity(requestDto.getCapacity());
        facility.setIndoorOutdoor(requestDto.getIndoorOutdoor());
        facility.setStatus(requestDto.getStatus());

        // DTO field "active" -> entity field "isBookable"
        facility.setIsBookable(requestDto.getActive() != null ? requestDto.getActive() : true);

        // entity relationship field = supportedEquipment
        if (requestDto.getEquipmentIds() != null) {
            List<Equipment> equipmentList = equipmentRepository.findAllById(requestDto.getEquipmentIds());
            Set<Equipment> equipmentSet = new HashSet<>(equipmentList);
            facility.setSupportedEquipment(equipmentSet);
        } else {
            facility.setSupportedEquipment(new HashSet<>());
        }
    }

    private FacilityResponseDto mapFacilityToResponseDto(Facility facility) {
        FacilityResponseDto dto = new FacilityResponseDto();

        dto.setId(facility.getId());
        dto.setName(facility.getName());

        // entity field "facilityCode" -> DTO field "code"
        dto.setCode(facility.getFacilityCode());

        dto.setDescription(facility.getDescription());
        dto.setFacilityType(facility.getFacilityType());
        dto.setBuilding(facility.getBuilding());
        dto.setCapacity(facility.getCapacity());
        dto.setIndoorOutdoor(facility.getIndoorOutdoor());
        dto.setStatus(facility.getStatus());

        // entity field "isBookable" -> DTO field "active"
        dto.setActive(facility.getIsBookable());

        List<Long> equipmentIds = new ArrayList<>();
        List<String> equipmentNames = new ArrayList<>();

        if (facility.getSupportedEquipment() != null) {
            for (Equipment equipment : facility.getSupportedEquipment()) {
                equipmentIds.add(equipment.getId());
                equipmentNames.add(equipment.getName());
            }
        }

        dto.setEquipmentIds(equipmentIds);
        dto.setEquipmentNames(equipmentNames);

        return dto;
    }
}
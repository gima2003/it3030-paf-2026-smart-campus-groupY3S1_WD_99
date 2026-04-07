package com.smartcampus.smart_campus_api.service;

import com.smartcampus.smart_campus_api.dto.FacilityRequestDto;
import com.smartcampus.smart_campus_api.dto.FacilityResponseDto;

import java.util.List;

public interface FacilityService {

    FacilityResponseDto createFacility(FacilityRequestDto requestDto);

    List<FacilityResponseDto> getAllFacilities();

    FacilityResponseDto getFacilityById(Long id);

    FacilityResponseDto updateFacility(Long id, FacilityRequestDto requestDto);

    void deleteFacility(Long id);
}
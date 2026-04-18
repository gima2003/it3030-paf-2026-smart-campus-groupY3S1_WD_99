package com.smartcampus.smart_campus_api.service;

import com.smartcampus.smart_campus_api.dto.ImageRequestDto;
import com.smartcampus.smart_campus_api.dto.ImageResponseDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FacilityImageService {

    ImageResponseDto uploadImage(Long facilityId, MultipartFile file, Boolean isPrimary);

    List<ImageResponseDto> getImagesByFacilityId(Long facilityId);

    ImageResponseDto updateImage(Long facilityId, Long imageId, ImageRequestDto requestDto);

    void deleteImage(Long facilityId, Long imageId);

    ImageResponseDto setPrimaryImage(Long facilityId, Long imageId);
}
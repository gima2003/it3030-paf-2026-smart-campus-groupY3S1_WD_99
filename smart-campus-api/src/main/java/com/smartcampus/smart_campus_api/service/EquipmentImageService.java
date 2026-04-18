package com.smartcampus.smart_campus_api.service;

import com.smartcampus.smart_campus_api.dto.ImageRequestDto;
import com.smartcampus.smart_campus_api.dto.ImageResponseDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface EquipmentImageService {

    ImageResponseDto uploadImage(Long equipmentId, MultipartFile file, Boolean isPrimary);

    List<ImageResponseDto> getImagesByEquipmentId(Long equipmentId);

    ImageResponseDto updateImage(Long equipmentId, Long imageId, ImageRequestDto requestDto);

    void deleteImage(Long equipmentId, Long imageId);

    ImageResponseDto setPrimaryImage(Long equipmentId, Long imageId);
}
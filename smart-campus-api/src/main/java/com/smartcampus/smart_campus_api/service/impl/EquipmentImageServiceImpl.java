package com.smartcampus.smart_campus_api.service.impl;

import com.smartcampus.smart_campus_api.dto.ImageRequestDto;
import com.smartcampus.smart_campus_api.dto.ImageResponseDto;
import com.smartcampus.smart_campus_api.entity.Equipment;
import com.smartcampus.smart_campus_api.entity.EquipmentImage;
import com.smartcampus.smart_campus_api.repository.EquipmentImageRepository;
import com.smartcampus.smart_campus_api.repository.EquipmentRepository;
import com.smartcampus.smart_campus_api.service.CloudinaryStorageService;
import com.smartcampus.smart_campus_api.service.EquipmentImageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class EquipmentImageServiceImpl implements EquipmentImageService {

    private final EquipmentRepository equipmentRepository;
    private final EquipmentImageRepository equipmentImageRepository;
    private final CloudinaryStorageService cloudinaryStorageService;

    public EquipmentImageServiceImpl(EquipmentRepository equipmentRepository,
                                     EquipmentImageRepository equipmentImageRepository,
                                     CloudinaryStorageService cloudinaryStorageService) {
        this.equipmentRepository = equipmentRepository;
        this.equipmentImageRepository = equipmentImageRepository;
        this.cloudinaryStorageService = cloudinaryStorageService;
    }

    @Override
    public ImageResponseDto uploadImage(Long equipmentId, MultipartFile file, Boolean isPrimary) {
        try {
            Equipment equipment = equipmentRepository.findById(equipmentId)
                    .orElseThrow(() -> new RuntimeException("Equipment not found with id: " + equipmentId));

            if (file == null || file.isEmpty()) {
                throw new RuntimeException("Image file is required");
            }

            if (Boolean.TRUE.equals(isPrimary)) {
                clearPrimaryFlagForEquipment(equipmentId);
            }

            Map<String, Object> uploadResult = cloudinaryStorageService.uploadImage(file, "smart-campus/equipment");

            EquipmentImage image = new EquipmentImage();
            image.setEquipment(equipment);
            image.setImageUrl((String) uploadResult.get("secure_url"));
            image.setStorageKey((String) uploadResult.get("public_id"));
            image.setFileName(file.getOriginalFilename());
            image.setIsPrimary(isPrimary != null ? isPrimary : false);

            EquipmentImage savedImage = equipmentImageRepository.save(image);
            return mapToResponse(savedImage);

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload equipment image", e);
        }
    }

    @Override
    public List<ImageResponseDto> getImagesByEquipmentId(Long equipmentId) {
        equipmentRepository.findById(equipmentId)
                .orElseThrow(() -> new RuntimeException("Equipment not found with id: " + equipmentId));

        List<EquipmentImage> images = equipmentImageRepository
                .findByEquipmentIdOrderByIsPrimaryDescUploadedAtDesc(equipmentId);

        List<ImageResponseDto> responseList = new ArrayList<>();
        for (EquipmentImage image : images) {
            responseList.add(mapToResponse(image));
        }

        return responseList;
    }

    @Override
    public ImageResponseDto updateImage(Long equipmentId, Long imageId, ImageRequestDto requestDto) {
        equipmentRepository.findById(equipmentId)
                .orElseThrow(() -> new RuntimeException("Equipment not found with id: " + equipmentId));

        EquipmentImage image = equipmentImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Equipment image not found with id: " + imageId));

        if (!image.getEquipment().getId().equals(equipmentId)) {
            throw new RuntimeException("Image does not belong to equipment id: " + equipmentId);
        }

        if (Boolean.TRUE.equals(requestDto.getIsPrimary())) {
            clearPrimaryFlagForEquipment(equipmentId);
        }

        image.setImageUrl(requestDto.getImageUrl());
        image.setStorageKey(requestDto.getStorageKey());
        image.setFileName(requestDto.getFileName());
        image.setIsPrimary(requestDto.getIsPrimary() != null ? requestDto.getIsPrimary() : image.getIsPrimary());

        EquipmentImage updatedImage = equipmentImageRepository.save(image);
        return mapToResponse(updatedImage);
    }

    @Override
    public void deleteImage(Long equipmentId, Long imageId) {
        try {
            equipmentRepository.findById(equipmentId)
                    .orElseThrow(() -> new RuntimeException("Equipment not found with id: " + equipmentId));

            EquipmentImage image = equipmentImageRepository.findById(imageId)
                    .orElseThrow(() -> new RuntimeException("Equipment image not found with id: " + imageId));

            if (!image.getEquipment().getId().equals(equipmentId)) {
                throw new RuntimeException("Image does not belong to equipment id: " + equipmentId);
            }

            if (image.getStorageKey() != null && !image.getStorageKey().isBlank()) {
                cloudinaryStorageService.deleteImage(image.getStorageKey());
            }

            equipmentImageRepository.delete(image);

        } catch (IOException e) {
            throw new RuntimeException("Failed to delete equipment image from Cloudinary", e);
        }
    }

    @Override
    public ImageResponseDto setPrimaryImage(Long equipmentId, Long imageId) {
        equipmentRepository.findById(equipmentId)
                .orElseThrow(() -> new RuntimeException("Equipment not found with id: " + equipmentId));

        EquipmentImage image = equipmentImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Equipment image not found with id: " + imageId));

        if (!image.getEquipment().getId().equals(equipmentId)) {
            throw new RuntimeException("Image does not belong to equipment id: " + equipmentId);
        }

        clearPrimaryFlagForEquipment(equipmentId);
        image.setIsPrimary(true);

        EquipmentImage updatedImage = equipmentImageRepository.save(image);
        return mapToResponse(updatedImage);
    }

    private void clearPrimaryFlagForEquipment(Long equipmentId) {
        List<EquipmentImage> images = equipmentImageRepository.findByEquipmentId(equipmentId);
        for (EquipmentImage img : images) {
            if (Boolean.TRUE.equals(img.getIsPrimary())) {
                img.setIsPrimary(false);
            }
        }
        equipmentImageRepository.saveAll(images);
    }

    private ImageResponseDto mapToResponse(EquipmentImage image) {
        ImageResponseDto dto = new ImageResponseDto();
        dto.setId(image.getId());
        dto.setImageUrl(image.getImageUrl());
        dto.setStorageKey(image.getStorageKey());
        dto.setFileName(image.getFileName());
        dto.setIsPrimary(image.getIsPrimary());
        dto.setUploadedAt(image.getUploadedAt());
        return dto;
    }
}
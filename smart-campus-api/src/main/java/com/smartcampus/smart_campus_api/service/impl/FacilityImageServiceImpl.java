package com.smartcampus.smart_campus_api.service.impl;

import com.smartcampus.smart_campus_api.dto.ImageRequestDto;
import com.smartcampus.smart_campus_api.dto.ImageResponseDto;
import com.smartcampus.smart_campus_api.entity.Facility;
import com.smartcampus.smart_campus_api.entity.FacilityImage;
import com.smartcampus.smart_campus_api.repository.FacilityImageRepository;
import com.smartcampus.smart_campus_api.repository.FacilityRepository;
import com.smartcampus.smart_campus_api.service.CloudinaryStorageService;
import com.smartcampus.smart_campus_api.service.FacilityImageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class FacilityImageServiceImpl implements FacilityImageService {

    private final FacilityRepository facilityRepository;
    private final FacilityImageRepository facilityImageRepository;
    private final CloudinaryStorageService cloudinaryStorageService;

    public FacilityImageServiceImpl(FacilityRepository facilityRepository,
                                    FacilityImageRepository facilityImageRepository,
                                    CloudinaryStorageService cloudinaryStorageService) {
        this.facilityRepository = facilityRepository;
        this.facilityImageRepository = facilityImageRepository;
        this.cloudinaryStorageService = cloudinaryStorageService;
    }

    @Override
    public ImageResponseDto uploadImage(Long facilityId, MultipartFile file, Boolean isPrimary) {
        try {
            Facility facility = facilityRepository.findById(facilityId)
                    .orElseThrow(() -> new RuntimeException("Facility not found with id: " + facilityId));

            if (file == null || file.isEmpty()) {
                throw new RuntimeException("Image file is required");
            }

            if (Boolean.TRUE.equals(isPrimary)) {
                clearPrimaryFlagForFacility(facilityId);
            }

            Map<String, Object> uploadResult = cloudinaryStorageService.uploadImage(file, "smart-campus/facilities");

            FacilityImage image = new FacilityImage();
            image.setFacility(facility);
            image.setImageUrl((String) uploadResult.get("secure_url"));
            image.setStorageKey((String) uploadResult.get("public_id"));
            image.setFileName(file.getOriginalFilename());
            image.setIsPrimary(isPrimary != null ? isPrimary : false);

            FacilityImage savedImage = facilityImageRepository.save(image);
            return mapToResponse(savedImage);

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload facility image", e);
        }
    }

    @Override
    public List<ImageResponseDto> getImagesByFacilityId(Long facilityId) {
        facilityRepository.findById(facilityId)
                .orElseThrow(() -> new RuntimeException("Facility not found with id: " + facilityId));

        List<FacilityImage> images = facilityImageRepository
                .findByFacilityIdOrderByIsPrimaryDescUploadedAtDesc(facilityId);

        List<ImageResponseDto> responseList = new ArrayList<>();
        for (FacilityImage image : images) {
            responseList.add(mapToResponse(image));
        }

        return responseList;
    }

    @Override
    public ImageResponseDto updateImage(Long facilityId, Long imageId, ImageRequestDto requestDto) {
        facilityRepository.findById(facilityId)
                .orElseThrow(() -> new RuntimeException("Facility not found with id: " + facilityId));

        FacilityImage image = facilityImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Facility image not found with id: " + imageId));

        if (!image.getFacility().getId().equals(facilityId)) {
            throw new RuntimeException("Image does not belong to facility id: " + facilityId);
        }

        if (Boolean.TRUE.equals(requestDto.getIsPrimary())) {
            clearPrimaryFlagForFacility(facilityId);
        }

        image.setImageUrl(requestDto.getImageUrl());
        image.setStorageKey(requestDto.getStorageKey());
        image.setFileName(requestDto.getFileName());
        image.setIsPrimary(requestDto.getIsPrimary() != null ? requestDto.getIsPrimary() : image.getIsPrimary());

        FacilityImage updatedImage = facilityImageRepository.save(image);
        return mapToResponse(updatedImage);
    }

    @Override
    public void deleteImage(Long facilityId, Long imageId) {
        try {
            facilityRepository.findById(facilityId)
                    .orElseThrow(() -> new RuntimeException("Facility not found with id: " + facilityId));

            FacilityImage image = facilityImageRepository.findById(imageId)
                    .orElseThrow(() -> new RuntimeException("Facility image not found with id: " + imageId));

            if (!image.getFacility().getId().equals(facilityId)) {
                throw new RuntimeException("Image does not belong to facility id: " + facilityId);
            }

            if (image.getStorageKey() != null && !image.getStorageKey().isBlank()) {
                cloudinaryStorageService.deleteImage(image.getStorageKey());
            }

            facilityImageRepository.delete(image);

        } catch (IOException e) {
            throw new RuntimeException("Failed to delete facility image from Cloudinary", e);
        }
    }

    @Override
    public ImageResponseDto setPrimaryImage(Long facilityId, Long imageId) {
        facilityRepository.findById(facilityId)
                .orElseThrow(() -> new RuntimeException("Facility not found with id: " + facilityId));

        FacilityImage image = facilityImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Facility image not found with id: " + imageId));

        if (!image.getFacility().getId().equals(facilityId)) {
            throw new RuntimeException("Image does not belong to facility id: " + facilityId);
        }

        clearPrimaryFlagForFacility(facilityId);
        image.setIsPrimary(true);

        FacilityImage updatedImage = facilityImageRepository.save(image);
        return mapToResponse(updatedImage);
    }

    private void clearPrimaryFlagForFacility(Long facilityId) {
        List<FacilityImage> images = facilityImageRepository.findByFacilityId(facilityId);
        for (FacilityImage img : images) {
            if (Boolean.TRUE.equals(img.getIsPrimary())) {
                img.setIsPrimary(false);
            }
        }
        facilityImageRepository.saveAll(images);
    }

    private ImageResponseDto mapToResponse(FacilityImage image) {
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
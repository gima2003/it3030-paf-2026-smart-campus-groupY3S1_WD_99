package com.smartcampus.smart_campus_api.controller;

import com.smartcampus.smart_campus_api.dto.ImageRequestDto;
import com.smartcampus.smart_campus_api.dto.ImageResponseDto;
import com.smartcampus.smart_campus_api.service.FacilityImageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/facilities/{facilityId}/images")
@CrossOrigin(origins = "*")
public class FacilityImageController {

    private final FacilityImageService facilityImageService;

    public FacilityImageController(FacilityImageService facilityImageService) {
        this.facilityImageService = facilityImageService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImageResponseDto> uploadImage(@PathVariable Long facilityId,
                                                        @RequestParam("file") MultipartFile file,
                                                        @RequestParam(value = "isPrimary", required = false) Boolean isPrimary) {
        ImageResponseDto response = facilityImageService.uploadImage(facilityId, file, isPrimary);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ImageResponseDto>> getImages(@PathVariable Long facilityId) {
        List<ImageResponseDto> response = facilityImageService.getImagesByFacilityId(facilityId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{imageId}")
    public ResponseEntity<ImageResponseDto> updateImage(@PathVariable Long facilityId,
                                                        @PathVariable Long imageId,
                                                        @RequestBody ImageRequestDto requestDto) {
        ImageResponseDto response = facilityImageService.updateImage(facilityId, imageId, requestDto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{imageId}")
    public ResponseEntity<String> deleteImage(@PathVariable Long facilityId,
                                              @PathVariable Long imageId) {
        facilityImageService.deleteImage(facilityId, imageId);
        return ResponseEntity.ok("Facility image deleted successfully");
    }

    @PatchMapping("/{imageId}/set-primary")
    public ResponseEntity<ImageResponseDto> setPrimaryImage(@PathVariable Long facilityId,
                                                            @PathVariable Long imageId) {
        ImageResponseDto response = facilityImageService.setPrimaryImage(facilityId, imageId);
        return ResponseEntity.ok(response);
    }
}
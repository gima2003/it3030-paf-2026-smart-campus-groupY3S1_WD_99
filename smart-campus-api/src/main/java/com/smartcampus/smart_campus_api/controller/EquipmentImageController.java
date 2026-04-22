package com.smartcampus.smart_campus_api.controller;

import com.smartcampus.smart_campus_api.dto.ImageRequestDto;
import com.smartcampus.smart_campus_api.dto.ImageResponseDto;
import com.smartcampus.smart_campus_api.service.EquipmentImageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/equipment/{equipmentId}/images")
@CrossOrigin(origins = "*")
public class EquipmentImageController {

    private final EquipmentImageService equipmentImageService;

    public EquipmentImageController(EquipmentImageService equipmentImageService) {
        this.equipmentImageService = equipmentImageService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImageResponseDto> uploadImage(@PathVariable Long equipmentId,
                                                        @RequestParam("file") MultipartFile file,
                                                        @RequestParam(value = "isPrimary", required = false) Boolean isPrimary) {
        ImageResponseDto response = equipmentImageService.uploadImage(equipmentId, file, isPrimary);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ImageResponseDto>> getImages(@PathVariable Long equipmentId) {
        List<ImageResponseDto> response = equipmentImageService.getImagesByEquipmentId(equipmentId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{imageId}")
    public ResponseEntity<ImageResponseDto> updateImage(@PathVariable Long equipmentId,
                                                        @PathVariable Long imageId,
                                                        @RequestBody ImageRequestDto requestDto) {
        ImageResponseDto response = equipmentImageService.updateImage(equipmentId, imageId, requestDto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{imageId}")
    public ResponseEntity<String> deleteImage(@PathVariable Long equipmentId,
                                              @PathVariable Long imageId) {
        equipmentImageService.deleteImage(equipmentId, imageId);
        return ResponseEntity.ok("Equipment image deleted successfully");
    }

    @PatchMapping("/{imageId}/set-primary")
    public ResponseEntity<ImageResponseDto> setPrimaryImage(@PathVariable Long equipmentId,
                                                            @PathVariable Long imageId) {
        ImageResponseDto response = equipmentImageService.setPrimaryImage(equipmentId, imageId);
        return ResponseEntity.ok(response);
    }
}
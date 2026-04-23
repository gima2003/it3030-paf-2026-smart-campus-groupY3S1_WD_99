package com.smartcampus.smart_campus_api.dto;

import java.time.LocalDateTime;

public class ImageResponseDto {

    private Long id;
    private String imageUrl;
    private String storageKey;
    private String fileName;
    private Boolean isPrimary;
    private LocalDateTime uploadedAt;

    public ImageResponseDto() {
    }

    public Long getId() {
        return id;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getStorageKey() {
        return storageKey;
    }

    public String getFileName() {
        return fileName;
    }

    public Boolean getIsPrimary() {
        return isPrimary;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setStorageKey(String storageKey) {
        this.storageKey = storageKey;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public void setIsPrimary(Boolean isPrimary) {
        this.isPrimary = isPrimary;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}
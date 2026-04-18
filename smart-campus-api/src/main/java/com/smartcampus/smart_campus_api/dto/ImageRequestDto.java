package com.smartcampus.smart_campus_api.dto;

public class ImageRequestDto {

    private String imageUrl;
    private String storageKey;
    private String fileName;
    private Boolean isPrimary;

    public ImageRequestDto() {
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
}
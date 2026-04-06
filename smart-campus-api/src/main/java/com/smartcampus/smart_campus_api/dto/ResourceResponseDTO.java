package com.smartcampus.smart_campus_api.dto;

import com.smartcampus.smart_campus_api.entity.ResourceStatus;
import com.smartcampus.smart_campus_api.entity.ResourceType;

import java.time.LocalDateTime;

public class ResourceResponseDTO {

    private Long id;
    private String resourceCode;
    private String name;
    private ResourceType type;
    private String description;
    private ResourceStatus status;
    private Boolean isBookable;
    private String location;
    private Integer capacity;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ResourceResponseDTO() {
    }

    public ResourceResponseDTO(Long id, String resourceCode, String name, ResourceType type,
                               String description, ResourceStatus status, Boolean isBookable,
                               String location, Integer capacity,
                               LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.resourceCode = resourceCode;
        this.name = name;
        this.type = type;
        this.description = description;
        this.status = status;
        this.isBookable = isBookable;
        this.location = location;
        this.capacity = capacity;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public String getResourceCode() {
        return resourceCode;
    }

    public void setResourceCode(String resourceCode) {
        this.resourceCode = resourceCode;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public ResourceType getType() {
        return type;
    }

    public void setType(ResourceType type) {
        this.type = type;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public ResourceStatus getStatus() {
        return status;
    }

    public void setStatus(ResourceStatus status) {
        this.status = status;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getIsBookable() {
        return isBookable;
    }

    public void setIsBookable(Boolean isBookable) {
        this.isBookable = isBookable;
    }

    public String getLocation() {
        return location;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
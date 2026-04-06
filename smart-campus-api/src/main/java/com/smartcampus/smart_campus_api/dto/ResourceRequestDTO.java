package com.smartcampus.smart_campus_api.dto;

import com.smartcampus.smart_campus_api.entity.ResourceStatus;
import com.smartcampus.smart_campus_api.entity.ResourceType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ResourceRequestDTO {

    @NotBlank(message = "Resource code is required")
    @Size(max = 50, message = "Resource code cannot exceed 50 characters")
    private String resourceCode;

    @NotBlank(message = "Resource name is required")
    @Size(max = 100, message = "Resource name cannot exceed 100 characters")
    private String name;

    @NotNull(message = "Resource type is required")
    private ResourceType type;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    @NotNull(message = "Resource status is required")
    private ResourceStatus status;

    @NotNull(message = "Bookable flag is required")
    private Boolean isBookable;

    @Size(max = 150, message = "Location cannot exceed 150 characters")
    private String location;

    @Min(value = 0, message = "Capacity cannot be negative")
    private Integer capacity;

    public ResourceRequestDTO() {
    }

    public String getResourceCode() {
        return resourceCode;
    }

    public void setResourceCode(String resourceCode) {
        this.resourceCode = resourceCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ResourceType getType() {
        return type;
    }

    public void setType(ResourceType type) {
        this.type = type;
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
}
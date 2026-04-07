package com.smartcampus.smart_campus_api.dto;

import com.smartcampus.smart_campus_api.entity.Resource_enum.AssetStatus;

import java.util.List;

public class EquipmentRequestDto {

    private String name;
    private String code;
    private String description;
    private String equipmentType;
    private Integer quantity;
    private AssetStatus status;
    private Boolean active;
    private List<Long> facilityIds;

    public EquipmentRequestDto() {
    }

    public String getName() {
        return name;
    }

    public String getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    public String getEquipmentType() {
        return equipmentType;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public AssetStatus getStatus() {
        return status;
    }

    public Boolean getActive() {
        return active;
    }

    public List<Long> getFacilityIds() {
        return facilityIds;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setEquipmentType(String equipmentType) {
        this.equipmentType = equipmentType;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public void setStatus(AssetStatus status) {
        this.status = status;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public void setFacilityIds(List<Long> facilityIds) {
        this.facilityIds = facilityIds;
    }
}
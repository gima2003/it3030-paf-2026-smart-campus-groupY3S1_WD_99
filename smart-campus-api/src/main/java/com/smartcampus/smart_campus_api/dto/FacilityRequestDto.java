package com.smartcampus.smart_campus_api.dto;

import com.smartcampus.smart_campus_api.entity.Resource_enum.AssetStatus;
import com.smartcampus.smart_campus_api.entity.Resource_enum.FacilityType;
import com.smartcampus.smart_campus_api.entity.Resource_enum.IndoorOutdoor;

import java.util.List;

public class FacilityRequestDto {

    private String name;
    private String code;
    private String description;
    private FacilityType facilityType;
    private String building;
    private String locationDetails;
    private Integer capacity;
    private IndoorOutdoor indoorOutdoor;
    private AssetStatus status;
    private Boolean active;
    private List<Long> equipmentIds;

    public FacilityRequestDto() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public FacilityType getFacilityType() {
        return facilityType;
    }

    public void setFacilityType(FacilityType facilityType) {
        this.facilityType = facilityType;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getBuilding() {
        return building;
    }

    public void setBuilding(String building) {
        this.building = building;
    }

    public String getLocationDetails() {
        return locationDetails;
    }

    public void setLocationDetails(String locationDetails) {
        this.locationDetails = locationDetails;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public IndoorOutdoor getIndoorOutdoor() {
        return indoorOutdoor;
    }

    public void setIndoorOutdoor(IndoorOutdoor indoorOutdoor) {
        this.indoorOutdoor = indoorOutdoor;
    }

    public AssetStatus getStatus() {
        return status;
    }

    public void setStatus(AssetStatus status) {
        this.status = status;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public List<Long> getEquipmentIds() {
        return equipmentIds;
    }

    public void setEquipmentIds(List<Long> equipmentIds) {
        this.equipmentIds = equipmentIds;
    }
}
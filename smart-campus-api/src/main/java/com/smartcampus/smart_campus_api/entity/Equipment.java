package com.smartcampus.smart_campus_api.entity;

import com.smartcampus.smart_campus_api.entity.Resource_enum.AssetStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "equipment")
public class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "equipment_code", nullable = false, unique = true, length = 50)
    private String equipmentCode;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "equipment_type", nullable = false, length = 100)
    private String equipmentType;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private AssetStatus status;

    @Column(name = "is_bookable", nullable = false)
    private Boolean isBookable = true;

    @Column(name = "serial_number", length = 100)
    private String serialNumber;

    @Column(name = "current_location", length = 150)
    private String currentLocation;

    private Integer quantity = 1;

    @Column(name = "condition_status", length = 50)
    private String conditionStatus;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @ManyToMany(mappedBy = "supportedEquipment")
    private Set<Facility> facilities = new HashSet<>();

    @OneToMany(mappedBy = "equipment", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<EquipmentImage> images = new HashSet<>();

    @OneToMany(mappedBy = "equipment", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<EquipmentScheduleSlot> scheduleSlots = new HashSet<>();

    public Equipment() {
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;

        if (this.status == null) {
            this.status = AssetStatus.ACTIVE;
        }

        if (this.isBookable == null) {
            this.isBookable = true;
        }

        if (this.quantity == null) {
            this.quantity = 1;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getEquipmentCode() {
        return equipmentCode;
    }

    public void setEquipmentCode(String equipmentCode) {
        this.equipmentCode = equipmentCode;
    }

    public String getName() {
        return name;
    }

    public String getEquipmentType() {
        return equipmentType;
    }

    public void setEquipmentType(String equipmentType) {
        this.equipmentType = equipmentType;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public AssetStatus getStatus() {
        return status;
    }

    public void setStatus(AssetStatus status) {
        this.status = status;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getIsBookable() {
        return isBookable;
    }

    public void setIsBookable(Boolean bookable) {
        isBookable = bookable;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public String getCurrentLocation() {
        return currentLocation;
    }

    public void setCurrentLocation(String currentLocation) {
        this.currentLocation = currentLocation;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getConditionStatus() {
        return conditionStatus;
    }

    public void setConditionStatus(String conditionStatus) {
        this.conditionStatus = conditionStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public Set<Facility> getFacilities() {
        return facilities;
    }

    public void setFacilities(Set<Facility> facilities) {
        this.facilities = facilities;
    }

    public Set<EquipmentImage> getImages() {
        return images;
    }

    public void setImages(Set<EquipmentImage> images) {
        this.images = images;
    }

    public Set<EquipmentScheduleSlot> getScheduleSlots() {
        return scheduleSlots;
    }

    public void setScheduleSlots(Set<EquipmentScheduleSlot> scheduleSlots) {
        this.scheduleSlots = scheduleSlots;
    }
}
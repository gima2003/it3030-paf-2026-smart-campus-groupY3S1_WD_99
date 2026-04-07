package com.smartcampus.smart_campus_api.entity;

import com.smartcampus.smart_campus_api.entity.Resource_enum.AssetStatus;
import com.smartcampus.smart_campus_api.entity.Resource_enum.FacilityType;
import com.smartcampus.smart_campus_api.entity.Resource_enum.IndoorOutdoor;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "facilities")
public class Facility {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "facility_code", nullable = false, unique = true, length = 50)
    private String facilityCode;

    @Column(nullable = false, length = 150)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "facility_type", nullable = false, length = 50)
    private FacilityType facilityType;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private AssetStatus status;

    @Column(name = "is_bookable", nullable = false)
    private Boolean isBookable = true;

    @Column(length = 100)
    private String building;

    @Column(length = 50)
    private String floor;

    @Column(name = "room_number", length = 50)
    private String roomNumber;

    @Column(length = 100)
    private String zone;

    private Integer capacity;

    @Column(name = "surface_type", length = 50)
    private String surfaceType;

    @Enumerated(EnumType.STRING)
    @Column(name = "indoor_outdoor", length = 20)
    private IndoorOutdoor indoorOutdoor;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @ManyToMany
    @JoinTable(
            name = "facility_equipment_map",
            joinColumns = @JoinColumn(name = "facility_id"),
            inverseJoinColumns = @JoinColumn(name = "equipment_id")
    )
    private Set<Equipment> supportedEquipment = new HashSet<>();

    @OneToMany(mappedBy = "facility", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<FacilityImage> images = new HashSet<>();

    @OneToMany(mappedBy = "facility", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<FacilityScheduleSlot> scheduleSlots = new HashSet<>();

    public Facility() {
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
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getFacilityCode() {
        return facilityCode;
    }

    public void setFacilityCode(String facilityCode) {
        this.facilityCode = facilityCode;
    }

    public String getName() {
        return name;
    }

    public FacilityType getFacilityType() {
        return facilityType;
    }

    public void setFacilityType(FacilityType facilityType) {
        this.facilityType = facilityType;
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

    public String getBuilding() {
        return building;
    }

    public void setBuilding(String building) {
        this.building = building;
    }

    public String getFloor() {
        return floor;
    }

    public void setFloor(String floor) {
        this.floor = floor;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getZone() {
        return zone;
    }

    public void setZone(String zone) {
        this.zone = zone;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public String getSurfaceType() {
        return surfaceType;
    }

    public void setSurfaceType(String surfaceType) {
        this.surfaceType = surfaceType;
    }

    public IndoorOutdoor getIndoorOutdoor() {
        return indoorOutdoor;
    }

    public void setIndoorOutdoor(IndoorOutdoor indoorOutdoor) {
        this.indoorOutdoor = indoorOutdoor;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public Set<Equipment> getSupportedEquipment() {
        return supportedEquipment;
    }

    public void setSupportedEquipment(Set<Equipment> supportedEquipment) {
        this.supportedEquipment = supportedEquipment;
    }

    public Set<FacilityImage> getImages() {
        return images;
    }

    public void setImages(Set<FacilityImage> images) {
        this.images = images;
    }

    public Set<FacilityScheduleSlot> getScheduleSlots() {
        return scheduleSlots;
    }

    public void setScheduleSlots(Set<FacilityScheduleSlot> scheduleSlots) {
        this.scheduleSlots = scheduleSlots;
    }
}
package com.smartcampus.smart_campus_api.dto;

import com.smartcampus.smart_campus_api.entity.BookingResourceType;

import java.time.LocalDate;
import java.time.LocalTime;

public class BookingRequestDto {

    private Long userId;
    private BookingResourceType resourceType;
    private Long facilityId;
    private Long equipmentId;
    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String purpose;
    private Integer attendees;

    public BookingRequestDto() {
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public BookingResourceType getResourceType() {
        return resourceType;
    }

    public void setResourceType(BookingResourceType resourceType) {
        this.resourceType = resourceType;
    }

    public Long getFacilityId() {
        return facilityId;
    }

    public void setFacilityId(Long facilityId) {
        this.facilityId = facilityId;
    }

    public Long getEquipmentId() {
        return equipmentId;
    }

    public void setEquipmentId(Long equipmentId) {
        this.equipmentId = equipmentId;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public Integer getAttendees() {
        return attendees;
    }

    public void setAttendees(Integer attendees) {
        this.attendees = attendees;
    }
}
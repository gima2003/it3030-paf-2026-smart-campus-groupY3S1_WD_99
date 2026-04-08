package com.smartcampus.smart_campus_api.repository;

import com.smartcampus.smart_campus_api.entity.FacilityScheduleSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FacilityScheduleSlotRepository extends JpaRepository<FacilityScheduleSlot, Long> {
    List<FacilityScheduleSlot> findByFacilityId(Long facilityId);
    List<FacilityScheduleSlot> findByFacilityIdAndSlotDateBetween(Long facilityId, LocalDate startDate, LocalDate endDate);
}
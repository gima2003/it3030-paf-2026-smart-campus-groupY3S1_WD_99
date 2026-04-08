package com.smartcampus.smart_campus_api.repository;

import com.smartcampus.smart_campus_api.entity.EquipmentScheduleSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EquipmentScheduleSlotRepository extends JpaRepository<EquipmentScheduleSlot, Long> {
    List<EquipmentScheduleSlot> findByEquipmentId(Long equipmentId);
    List<EquipmentScheduleSlot> findByEquipmentIdAndSlotDateBetween(Long equipmentId, LocalDate startDate, LocalDate endDate);
}
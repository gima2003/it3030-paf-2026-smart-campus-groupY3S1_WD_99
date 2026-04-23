package com.smartcampus.smart_campus_api.repository;

import com.smartcampus.smart_campus_api.entity.EquipmentImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipmentImageRepository extends JpaRepository<EquipmentImage, Long> {

    List<EquipmentImage> findByEquipmentId(Long equipmentId);

    List<EquipmentImage> findByEquipmentIdOrderByIsPrimaryDescUploadedAtDesc(Long equipmentId);
}
package com.smartcampus.smart_campus_api.repository;

import com.smartcampus.smart_campus_api.entity.Equipment;
import com.smartcampus.smart_campus_api.entity.Resource_enum.AssetStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {

    Optional<Equipment> findByEquipmentCode(String equipmentCode);

    boolean existsByEquipmentCode(String equipmentCode);

    List<Equipment> findByStatus(AssetStatus status);

    List<Equipment> findByNameContainingIgnoreCase(String name);

    List<Equipment> findByEquipmentTypeContainingIgnoreCase(String equipmentType);

    List<Equipment> findByCurrentLocationContainingIgnoreCase(String currentLocation);
}
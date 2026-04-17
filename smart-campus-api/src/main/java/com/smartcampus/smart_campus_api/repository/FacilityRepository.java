package com.smartcampus.smart_campus_api.repository;

import com.smartcampus.smart_campus_api.entity.Facility;
import com.smartcampus.smart_campus_api.entity.Resource_enum.AssetStatus;
import com.smartcampus.smart_campus_api.entity.Resource_enum.FacilityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FacilityRepository extends JpaRepository<Facility, Long> {

    Optional<Facility> findByFacilityCode(String facilityCode);

    boolean existsByFacilityCode(String facilityCode);

    List<Facility> findByFacilityType(FacilityType facilityType);

    List<Facility> findByStatus(AssetStatus status);

    List<Facility> findByFacilityTypeAndStatus(FacilityType facilityType, AssetStatus status);

    List<Facility> findByNameContainingIgnoreCase(String name);

    List<Facility> findByBuildingContainingIgnoreCase(String building);

    List<Facility> findByZoneContainingIgnoreCase(String zone);
}
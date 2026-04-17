package com.smartcampus.smart_campus_api.repository;

import com.smartcampus.smart_campus_api.entity.FacilityImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacilityImageRepository extends JpaRepository<FacilityImage, Long> {
    List<FacilityImage> findByFacilityId(Long facilityId);
}
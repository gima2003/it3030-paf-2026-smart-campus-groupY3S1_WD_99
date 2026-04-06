package com.smartcampus.smart_campus_api.repository;

import com.smartcampus.smart_campus_api.entity.Resource;
import com.smartcampus.smart_campus_api.entity.ResourceStatus;
import com.smartcampus.smart_campus_api.entity.ResourceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

    Optional<Resource> findByResourceCode(String resourceCode);

    boolean existsByResourceCode(String resourceCode);

    List<Resource> findByType(ResourceType type);

    List<Resource> findByStatus(ResourceStatus status);

    List<Resource> findByTypeAndStatus(ResourceType type, ResourceStatus status);

    List<Resource> findByNameContainingIgnoreCase(String name);

    List<Resource> findByLocationContainingIgnoreCase(String location);
}
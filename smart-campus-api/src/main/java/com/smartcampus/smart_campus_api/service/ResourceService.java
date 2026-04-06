package com.smartcampus.smart_campus_api.service;

import com.smartcampus.smart_campus_api.dto.ResourceRequestDTO;
import com.smartcampus.smart_campus_api.dto.ResourceResponseDTO;

import java.util.List;

public interface ResourceService {

    ResourceResponseDTO createResource(ResourceRequestDTO requestDTO);

    List<ResourceResponseDTO> getAllResources();

    ResourceResponseDTO getResourceById(Long id);

    ResourceResponseDTO updateResource(Long id, ResourceRequestDTO requestDTO);

    void deleteResource(Long id);
}
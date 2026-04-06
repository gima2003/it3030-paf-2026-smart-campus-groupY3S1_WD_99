package com.smartcampus.smart_campus_api.service.impl;

import com.smartcampus.smart_campus_api.dto.ResourceRequestDTO;
import com.smartcampus.smart_campus_api.dto.ResourceResponseDTO;
import com.smartcampus.smart_campus_api.entity.Resource;
import com.smartcampus.smart_campus_api.repository.ResourceRepository;
import com.smartcampus.smart_campus_api.service.ResourceService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;

    public ResourceServiceImpl(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    @Override
    public ResourceResponseDTO createResource(ResourceRequestDTO requestDTO) {
        if (resourceRepository.existsByResourceCode(requestDTO.getResourceCode())) {
            throw new RuntimeException("Resource code already exists");
        }

        Resource resource = new Resource();
        resource.setResourceCode(requestDTO.getResourceCode());
        resource.setName(requestDTO.getName());
        resource.setType(requestDTO.getType());
        resource.setDescription(requestDTO.getDescription());
        resource.setStatus(requestDTO.getStatus());
        resource.setIsBookable(requestDTO.getIsBookable());
        resource.setLocation(requestDTO.getLocation());
        resource.setCapacity(requestDTO.getCapacity());

        Resource savedResource = resourceRepository.save(resource);
        return mapToResponseDTO(savedResource);
    }

    @Override
    public List<ResourceResponseDTO> getAllResources() {
        return resourceRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ResourceResponseDTO getResourceById(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with id: " + id));

        return mapToResponseDTO(resource);
    }

    @Override
    public ResourceResponseDTO updateResource(Long id, ResourceRequestDTO requestDTO) {
        Resource existingResource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with id: " + id));

        if (!existingResource.getResourceCode().equals(requestDTO.getResourceCode())
                && resourceRepository.existsByResourceCode(requestDTO.getResourceCode())) {
            throw new RuntimeException("Resource code already exists");
        }

        existingResource.setResourceCode(requestDTO.getResourceCode());
        existingResource.setName(requestDTO.getName());
        existingResource.setType(requestDTO.getType());
        existingResource.setDescription(requestDTO.getDescription());
        existingResource.setStatus(requestDTO.getStatus());
        existingResource.setIsBookable(requestDTO.getIsBookable());
        existingResource.setLocation(requestDTO.getLocation());
        existingResource.setCapacity(requestDTO.getCapacity());

        Resource updatedResource = resourceRepository.save(existingResource);
        return mapToResponseDTO(updatedResource);
    }

    @Override
    public void deleteResource(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with id: " + id));

        resourceRepository.delete(resource);
    }

    private ResourceResponseDTO mapToResponseDTO(Resource resource) {
        ResourceResponseDTO responseDTO = new ResourceResponseDTO();
        responseDTO.setId(resource.getId());
        responseDTO.setResourceCode(resource.getResourceCode());
        responseDTO.setName(resource.getName());
        responseDTO.setType(resource.getType());
        responseDTO.setDescription(resource.getDescription());
        responseDTO.setStatus(resource.getStatus());
        responseDTO.setIsBookable(resource.getIsBookable());
        responseDTO.setLocation(resource.getLocation());
        responseDTO.setCapacity(resource.getCapacity());
        responseDTO.setCreatedAt(resource.getCreatedAt());
        responseDTO.setUpdatedAt(resource.getUpdatedAt());

        return responseDTO;
    }
}
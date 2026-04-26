package com.smartcampus.smart_campus_api.service;



import com.smartcampus.smart_campus_api.entity.Resource;
import com.smartcampus.smart_campus_api.entity.ResourceStatus;
import com.smartcampus.smart_campus_api.entity.ResourceType;
import com.smartcampus.smart_campus_api.repository.ResourceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public ResourceService(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    public Resource createResource(Resource resource) {
        return resourceRepository.save(resource);
    }

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public Resource getResourceById(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));
    }

    public Resource updateResource(Long id, Resource updated) {
        Resource resource = getResourceById(id);

        resource.setName(updated.getName());
        resource.setType(updated.getType());
        resource.setCapacity(updated.getCapacity());
        resource.setLocation(updated.getLocation());
        resource.setDescription(updated.getDescription());
        resource.setStatus(updated.getStatus());

        return resourceRepository.save(resource);
    }

    public void deleteResource(Long id) {
        resourceRepository.deleteById(id);
    }

    public List<Resource> filterResources(ResourceType type,
                                      ResourceStatus status,
                                      Integer capacity,
                                      String location) {

    List<Resource> resources = resourceRepository.findAll();

    if (type != null) {
        resources = resources.stream()
                .filter(r -> r.getType() == type)
                .toList();
    }

    if (status != null) {
        resources = resources.stream()
                .filter(r -> r.getStatus() == status)
                .toList();
    }

    if (capacity != null) {
        resources = resources.stream()
                .filter(r -> r.getCapacity() >= capacity)
                .toList();
    }

    if (location != null && !location.isBlank()) {
        resources = resources.stream()
                .filter(r -> r.getLocation().toLowerCase()
                        .contains(location.toLowerCase()))
                .toList();
    }

    return resources;
}
}
package com.smartcampus.smart_campus_api.controller;

import com.smartcampus.smart_campus_api.entity.Resource;
import com.smartcampus.smart_campus_api.entity.ResourceStatus;
import com.smartcampus.smart_campus_api.entity.ResourceType;
import com.smartcampus.smart_campus_api.service.ResourceService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "http://localhost:5173")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @PostMapping
    public Resource create(@Valid @RequestBody Resource resource) {
        return resourceService.createResource(resource);
    }

    // ✅ Single GET method (handles both normal + filter)
    @GetMapping
    public List<Resource> filterResources(
            @RequestParam(required = false) ResourceType type,
            @RequestParam(required = false) ResourceStatus status,
            @RequestParam(required = false) Integer capacity,
            @RequestParam(required = false) String location
    ) {
        return resourceService.filterResources(type, status, capacity, location);
    }

    @GetMapping("/{id}")
    public Resource getById(@PathVariable Long id) {
        return resourceService.getResourceById(id);
    }

    @PutMapping("/{id}")
    public Resource update(@PathVariable Long id,
                           @Valid @RequestBody Resource resource) {
        return resourceService.updateResource(id, resource);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        resourceService.deleteResource(id);
    }
}
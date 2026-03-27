package com.smartcampus.smart_campus_api.controller;

import com.smartcampus.smart_campus_api.entity.TicketAttachment;
import com.smartcampus.smart_campus_api.service.TicketAttachmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/ticket-attachments")
@CrossOrigin(origins = "http://localhost:5173")
public class TicketAttachmentController {

    @Autowired
    private TicketAttachmentService ticketAttachmentService;

    // Upload images for a ticket
    @PostMapping("/upload/{ticketId}")
    public List<TicketAttachment> uploadAttachments(
            @PathVariable Long ticketId,
            @RequestParam("files") MultipartFile[] files
    ) throws Exception {
        return ticketAttachmentService.uploadAttachments(ticketId, files);
    }

    // Get all attachments for a ticket
    @GetMapping("/ticket/{ticketId}")
    public List<TicketAttachment> getAttachmentsByTicketId(@PathVariable Long ticketId) {
        return ticketAttachmentService.getAttachmentsByTicketId(ticketId);
    }

    // View image file
    @GetMapping("/view")
    public ResponseEntity<Resource> viewFile(@RequestParam String path) throws Exception {
        Path filePath = Paths.get(path).normalize();
        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.exists() || !resource.isReadable()) {
            return ResponseEntity.notFound().build();
        }

        String contentType = Files.probeContentType(filePath);
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + resource.getFilename() + "\"")
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }

    // Delete one attachment by id
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAttachment(@PathVariable Long id) throws Exception {
        ticketAttachmentService.deleteAttachment(id);
        return ResponseEntity.ok("Attachment deleted successfully");
    }
}
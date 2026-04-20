package com.smartcampus.smart_campus_api.controller;

import com.smartcampus.smart_campus_api.entity.TicketAttachment;
import com.smartcampus.smart_campus_api.service.TicketAttachmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/ticket-attachments")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class TicketAttachmentController {

    @Autowired
    private TicketAttachmentService ticketAttachmentService;

    @PostMapping("/upload/{ticketId}")
    public List<TicketAttachment> uploadAttachments(
            @PathVariable Long ticketId,
            @RequestParam("files") MultipartFile[] files
    ) throws Exception {
        return ticketAttachmentService.uploadAttachments(ticketId, files);
    }

    @GetMapping("/ticket/{ticketId}")
    public List<TicketAttachment> getAttachmentsByTicketId(@PathVariable Long ticketId) {
        return ticketAttachmentService.getAttachmentsByTicketId(ticketId);
    }

    // ✅ View image by attachment id
    @GetMapping("/view/{id}")
    public ResponseEntity<Resource> viewFileById(@PathVariable Long id) throws Exception {
        Resource resource = ticketAttachmentService.getAttachmentResourceById(id);
        String contentType = ticketAttachmentService.getAttachmentContentTypeById(id);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + resource.getFilename() + "\"")
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAttachment(@PathVariable Long id) throws Exception {
        ticketAttachmentService.deleteAttachment(id);
        return ResponseEntity.ok("Attachment deleted successfully");
    }
}
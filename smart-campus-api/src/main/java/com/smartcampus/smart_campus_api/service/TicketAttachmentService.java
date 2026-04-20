package com.smartcampus.smart_campus_api.service;

import com.smartcampus.smart_campus_api.entity.TicketAttachment;
import com.smartcampus.smart_campus_api.repository.TicketAttachmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class TicketAttachmentService {

    @Autowired
    private TicketAttachmentRepository ticketAttachmentRepository;

    private final Path uploadPath = Paths.get("uploads", "tickets").toAbsolutePath().normalize();

    public List<TicketAttachment> uploadAttachments(Long ticketId, MultipartFile[] files) throws IOException {
        if (files == null || files.length == 0) {
            return new ArrayList<>();
        }

        System.out.println("=== TICKET ATTACHMENT UPLOAD START ===");
        System.out.println("Ticket ID: " + ticketId);
        System.out.println("Files count received: " + files.length);

        // ✅ Check total images per ticket
        List<TicketAttachment> existingAttachments =
                ticketAttachmentRepository.findByTicketId(ticketId);

        int currentCount = existingAttachments.size();
        int newCount = files.length;

        System.out.println("Existing attachment count: " + currentCount);
        System.out.println("New attachment count: " + newCount);

        if (currentCount + newCount > 3) {
            throw new RuntimeException("Maximum 3 images allowed per ticket");
        }

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
            System.out.println("Created upload directory: " + uploadPath);
        }

        List<TicketAttachment> savedAttachments = new ArrayList<>();

        for (MultipartFile file : files) {
            System.out.println("-----------------------------------");
            System.out.println("Original filename: " + file.getOriginalFilename());
            System.out.println("Content type: " + file.getContentType());
            System.out.println("File size: " + file.getSize());
            System.out.println("Is empty: " + file.isEmpty());

            if (file.isEmpty()) {
                throw new RuntimeException("One of the selected files is empty");
            }

            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new RuntimeException("Only image files are allowed");
            }

            String originalName = file.getOriginalFilename();
            String safeOriginalName = originalName == null
                    ? "image"
                    : Paths.get(originalName).getFileName().toString();

            String uniqueFileName = UUID.randomUUID() + "_" + safeOriginalName;
            Path filePath = uploadPath.resolve(uniqueFileName).normalize();

            System.out.println("Saving file as: " + uniqueFileName);
            System.out.println("Saving to path: " + filePath);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            System.out.println("File saved successfully: " + Files.exists(filePath));

            TicketAttachment attachment = new TicketAttachment();
            attachment.setTicketId(ticketId);
            attachment.setFileName(safeOriginalName);
            attachment.setFilePath(filePath.toString().replace("\\", "/"));
            attachment.setContentType(contentType);

            TicketAttachment saved = ticketAttachmentRepository.save(attachment);
            savedAttachments.add(saved);

            System.out.println("Attachment DB record saved with ID: " + saved.getId());
        }

        System.out.println("=== TICKET ATTACHMENT UPLOAD END ===");
        return savedAttachments;
    }

    public List<TicketAttachment> getAttachmentsByTicketId(Long ticketId) {
        return ticketAttachmentRepository.findByTicketId(ticketId);
    }

    public Resource getAttachmentResourceById(Long id) throws Exception {
        TicketAttachment attachment = ticketAttachmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attachment not found with id: " + id));

        String storedPath = attachment.getFilePath();
        if (storedPath == null || storedPath.isBlank()) {
            throw new RuntimeException("Attachment path is empty");
        }

        Path filePath = Paths.get(storedPath).toAbsolutePath().normalize();

        System.out.println("View attachment ID: " + id);
        System.out.println("Stored path from DB: " + storedPath);
        System.out.println("Resolved absolute path: " + filePath);
        System.out.println("File exists on disk: " + Files.exists(filePath));

        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.exists() || !resource.isReadable()) {
            throw new RuntimeException("File not found on disk: " + filePath);
        }

        return resource;
    }

    public String getAttachmentContentTypeById(Long id) throws Exception {
        TicketAttachment attachment = ticketAttachmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attachment not found with id: " + id));

        String contentType = attachment.getContentType();

        if (contentType == null || contentType.isBlank()) {
            Path filePath = Paths.get(attachment.getFilePath()).toAbsolutePath().normalize();
            contentType = Files.probeContentType(filePath);
        }

        if (contentType == null || contentType.isBlank()) {
            contentType = "application/octet-stream";
        }

        return contentType;
    }

    public void deleteAttachment(Long id) throws IOException {
        TicketAttachment attachment = ticketAttachmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attachment not found with id: " + id));

        String storedPath = attachment.getFilePath();

        if (storedPath != null && !storedPath.isBlank()) {
            Path filePath = Paths.get(storedPath).toAbsolutePath().normalize();
            Files.deleteIfExists(filePath);
            System.out.println("Deleted physical file: " + filePath);
        }

        ticketAttachmentRepository.delete(attachment);
        System.out.println("Deleted attachment record with ID: " + id);
    }
}
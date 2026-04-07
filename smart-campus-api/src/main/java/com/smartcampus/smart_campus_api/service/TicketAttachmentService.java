package com.smartcampus.smart_campus_api.service;

import com.smartcampus.smart_campus_api.entity.TicketAttachment;
import com.smartcampus.smart_campus_api.repository.TicketAttachmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    private final String uploadDir = "uploads/tickets";

    public List<TicketAttachment> uploadAttachments(Long ticketId, MultipartFile[] files) throws IOException {
        if (files == null || files.length == 0) {
            return new ArrayList<>();
        }

        if (files.length > 3) {
            throw new RuntimeException("Maximum 3 images allowed");
        }

        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        List<TicketAttachment> savedAttachments = new ArrayList<>();

        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;

            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new RuntimeException("Only image files are allowed");
            }

            String originalName = file.getOriginalFilename();
            String uniqueFileName = UUID.randomUUID() + "_" + originalName;

            Path filePath = uploadPath.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            TicketAttachment attachment = new TicketAttachment();
            attachment.setTicketId(ticketId);
            attachment.setFileName(originalName);
            attachment.setFilePath(filePath.toString().replace("\\", "/"));
            attachment.setContentType(contentType);

            savedAttachments.add(ticketAttachmentRepository.save(attachment));
        }

        return savedAttachments;
    }

    public List<TicketAttachment> getAttachmentsByTicketId(Long ticketId) {
        return ticketAttachmentRepository.findByTicketId(ticketId);
    }

    public void deleteAttachment(Long id) throws IOException {
        TicketAttachment attachment = ticketAttachmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attachment not found with id: " + id));

        // Delete DB row even if physical file is missing
        String storedPath = attachment.getFilePath();

        if (storedPath != null && !storedPath.isBlank()) {
            Path filePath = Paths.get(storedPath).toAbsolutePath().normalize();
            Files.deleteIfExists(filePath);
        }

        ticketAttachmentRepository.delete(attachment);
    }
}
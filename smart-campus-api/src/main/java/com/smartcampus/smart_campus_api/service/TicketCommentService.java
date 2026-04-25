package com.smartcampus.smart_campus_api.service;

import com.smartcampus.smart_campus_api.entity.TicketComment;
import com.smartcampus.smart_campus_api.repository.TicketCommentRepository;
import com.smartcampus.smart_campus_api.repository.TicketRepository;
import com.smartcampus.smart_campus_api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TicketCommentService {

    @Autowired
    private TicketCommentRepository ticketCommentRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    public TicketComment createComment(TicketComment comment) {
        comment.setCreatedAt(LocalDateTime.now());
        TicketComment savedComment = ticketCommentRepository.save(comment);

        ticketRepository.findById(comment.getTicketId()).ifPresent(ticket -> {
            String title = "New Comment on Ticket";
            String message = "A new comment was added to your ticket '" + ticket.getTitle() + "'.";

            // Notify Ticket Owner if they are not the commenter
            if (!comment.getCreatedByEmail().equals(ticket.getCreatedByEmail())) {
                userRepository.findByEmail(ticket.getCreatedByEmail()).ifPresent(user -> {
                    String actionUrl = "LECTURER".equalsIgnoreCase(user.getRole()) ? "/lecturer/tickets"
                            : "/student/tickets";
                    notificationService.createSystemNotification(user.getId(), title, message, actionUrl);
                });
            }

            // Notify Technician if assigned and they are not the commenter
            if (ticket.getTechnicianEmail() != null
                    && !comment.getCreatedByEmail().equals(ticket.getTechnicianEmail())) {
                userRepository.findByEmail(ticket.getTechnicianEmail()).ifPresent(tech -> {
                    notificationService.createSystemNotification(tech.getId(), "New Comment on Assigned Ticket",
                            "A new comment was added to the ticket '" + ticket.getTitle() + "' assigned to you.",
                            "/technician/tickets");
                });
            }
        });

        return savedComment;
    }

    public List<TicketComment> getCommentsByTicketId(Long ticketId) {
        return ticketCommentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId);
    }
}

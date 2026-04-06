package com.smartcampus.smart_campus_api.service;

import com.smartcampus.smart_campus_api.entity.TicketComment;
import com.smartcampus.smart_campus_api.repository.TicketCommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TicketCommentService {

    @Autowired
    private TicketCommentRepository ticketCommentRepository;

    public TicketComment createComment(TicketComment comment) {
        comment.setCreatedAt(LocalDateTime.now());
        return ticketCommentRepository.save(comment);
    }

    public List<TicketComment> getCommentsByTicketId(Long ticketId) {
        return ticketCommentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId);
    }
}

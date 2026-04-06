package com.smartcampus.smart_campus_api.controller;

import com.smartcampus.smart_campus_api.entity.TicketComment;
import com.smartcampus.smart_campus_api.service.TicketCommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ticket-comments")
@CrossOrigin(origins = "http://localhost:5173")
public class TicketCommentController {

    @Autowired
    private TicketCommentService ticketCommentService;

    @PostMapping
    public TicketComment createComment(@RequestBody TicketComment comment) {
        return ticketCommentService.createComment(comment);
    }

    @GetMapping("/ticket/{ticketId}")
    public List<TicketComment> getCommentsByTicketId(@PathVariable Long ticketId) {
        return ticketCommentService.getCommentsByTicketId(ticketId);
    }
}
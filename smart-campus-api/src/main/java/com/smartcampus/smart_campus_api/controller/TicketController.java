package com.smartcampus.smart_campus_api.controller;

import com.smartcampus.smart_campus_api.dto.TicketAnalyticsResponse;
import com.smartcampus.smart_campus_api.dto.TicketResponse;
import com.smartcampus.smart_campus_api.entity.Ticket;
import com.smartcampus.smart_campus_api.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:5173")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    // 1. Create Ticket (Student)
    @PostMapping
    public Ticket createTicket(@RequestBody Ticket ticket) {
        return ticketService.createTicket(ticket);
    }

    // 2. Get all tickets (Admin)
    @GetMapping
    public List<TicketResponse> getAllTickets() {
        return ticketService.getAllTicketResponses();
    }

    // 3. Get tickets by user (Student / Lecturer)
    @GetMapping("/user/{email}")
    public List<TicketResponse> getUserTickets(@PathVariable String email) {
        return ticketService.getTicketResponsesByUser(email);
    }

    // 4. Get technician tickets
    @GetMapping("/technician/{email}")
    public List<TicketResponse> getTechnicianTickets(@PathVariable String email) {
        return ticketService.getTicketResponsesForTechnician(email);
    }

    // 5. Ticket SLA analytics summary
    @GetMapping("/analytics/summary")
    public TicketAnalyticsResponse getTicketAnalyticsSummary() {
        return ticketService.getTicketAnalyticsSummary();
    }

    // 6. Assign technician (Admin)
    @PutMapping("/{id}/assign")
    public Ticket assignTechnician(
            @PathVariable Long id,
            @RequestParam String technicianEmail
    ) {
        return ticketService.assignTechnician(id, technicianEmail);
    }

    // 7. Update status (Admin / Technician)
    @PutMapping("/{id}/status")
    public Ticket updateStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        return ticketService.updateStatus(id, status);
    }

    // 8. Edit ticket (Student) -> only allowed when status = OPEN
    @PutMapping("/{id}")
    public Ticket updateTicket(
            @PathVariable Long id,
            @RequestBody Ticket updatedTicket
    ) {
        return ticketService.updateTicket(id, updatedTicket);
    }
}
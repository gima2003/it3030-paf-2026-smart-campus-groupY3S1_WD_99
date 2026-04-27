package com.smartcampus.smart_campus_api.controller;

import com.smartcampus.smart_campus_api.dto.TicketAnalyticsResponse;
import com.smartcampus.smart_campus_api.dto.TicketResponse;
import com.smartcampus.smart_campus_api.entity.Ticket;
import com.smartcampus.smart_campus_api.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<Ticket> createTicket(@RequestBody Ticket ticket) {
        Ticket created = ticketService.createTicket(ticket);
        return ResponseEntity.status(201).body(created); // ✅ 201 CREATED
    }

    // 2. Get all tickets (Admin)
    @GetMapping
    public ResponseEntity<List<TicketResponse>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTicketResponses()); // ✅ 200 OK
    }

    // 3. Get tickets by user
    @GetMapping("/user/{email}")
    public ResponseEntity<List<TicketResponse>> getUserTickets(@PathVariable String email) {
        List<TicketResponse> tickets = ticketService.getTicketResponsesByUser(email);
        if (tickets.isEmpty()) {
            return ResponseEntity.status(404).build(); // ✅ 404 NOT FOUND
        }
        return ResponseEntity.ok(tickets); // ✅ 200 OK
    }

    // 4. Get technician tickets
    @GetMapping("/technician/{email}")
    public ResponseEntity<List<TicketResponse>> getTechnicianTickets(@PathVariable String email) {
        List<TicketResponse> tickets = ticketService.getTicketResponsesForTechnician(email);
        if (tickets.isEmpty()) {
            return ResponseEntity.status(404).build(); // ✅ 404
        }
        return ResponseEntity.ok(tickets); // ✅ 200
    }

    // 5. Ticket SLA analytics summary
    @GetMapping("/analytics/summary")
    public ResponseEntity<TicketAnalyticsResponse> getTicketAnalyticsSummary() {
        return ResponseEntity.ok(ticketService.getTicketAnalyticsSummary()); // ✅ 200
    }

    // 6. Assign technician (Admin)
    @PutMapping("/{id}/assign")
    public ResponseEntity<Ticket> assignTechnician(
            @PathVariable Long id,
            @RequestParam String technicianEmail
    ) {
        Ticket updated = ticketService.assignTechnician(id, technicianEmail);
        return ResponseEntity.ok(updated); // ✅ 200 OK
    }

    // 7. Update status
    @PutMapping("/{id}/status")
    public ResponseEntity<Ticket> updateStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        Ticket updated = ticketService.updateStatus(id, status);
        return ResponseEntity.ok(updated); // ✅ 200 OK
    }

    // 8. Edit ticket
    @PutMapping("/{id}")
    public ResponseEntity<Ticket> updateTicket(
            @PathVariable Long id,
            @RequestBody Ticket updatedTicket
    ) {
        Ticket updated = ticketService.updateTicket(id, updatedTicket);
        return ResponseEntity.ok(updated); // ✅ 200 OK
    }
}
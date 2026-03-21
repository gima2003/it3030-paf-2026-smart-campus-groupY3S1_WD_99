package com.smartcampus.smart_campus_api.controller;

import com.smartcampus.smart_campus_api.entity.Ticket;
import com.smartcampus.smart_campus_api.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:5173") // React app
public class TicketController {

    @Autowired
    private TicketService ticketService;

    // 🔹 1. Create Ticket (Student)
    @PostMapping
    public Ticket createTicket(@RequestBody Ticket ticket) {
        return ticketService.createTicket(ticket);
    }

    // 🔹 2. Get all tickets (Admin)
    @GetMapping
    public List<Ticket> getAllTickets() {
        return ticketService.getAllTickets();
    }

    // 🔹 3. Get tickets by user (Student / Lecturer)
    @GetMapping("/user/{email}")
    public List<Ticket> getUserTickets(@PathVariable String email) {
        return ticketService.getTicketsByUser(email);
    }

    // 🔹 4. Get technician tickets
    @GetMapping("/technician/{email}")
    public List<Ticket> getTechnicianTickets(@PathVariable String email) {
        return ticketService.getTicketsForTechnician(email);
    }

    // 🔹 5. Assign technician (Admin)
    @PutMapping("/{id}/assign")
    public Ticket assignTechnician(
            @PathVariable Long id,
            @RequestParam String technicianEmail
    ) {
        return ticketService.assignTechnician(id, technicianEmail);
    }

    // 🔹 6. Update status (Admin / Technician)
    @PutMapping("/{id}/status")
    public Ticket updateStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        return ticketService.updateStatus(id, status);
    }
}

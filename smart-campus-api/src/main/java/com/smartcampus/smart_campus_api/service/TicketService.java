package com.smartcampus.smart_campus_api.service;

import com.smartcampus.smart_campus_api.entity.Ticket;
import com.smartcampus.smart_campus_api.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    // 🔹 Create Ticket
    public Ticket createTicket(Ticket ticket) {
        ticket.setStatus("OPEN"); // default status
        return ticketRepository.save(ticket);
    }

    // 🔹 Get all tickets (Admin)
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    // 🔹 Get tickets by student/lecturer email
    public List<Ticket> getTicketsByUser(String email) {
        return ticketRepository.findByCreatedByEmail(email);
    }

    // 🔹 Get tickets assigned to technician
    public List<Ticket> getTicketsForTechnician(String email) {
        return ticketRepository.findByTechnicianEmail(email);
    }

    // 🔹 Assign technician
    public Ticket assignTechnician(Long ticketId, String technicianEmail) {
        Ticket ticket = ticketRepository.findById(ticketId).orElseThrow();
        ticket.setTechnicianEmail(technicianEmail);
        ticket.setStatus("IN_PROGRESS");
        return ticketRepository.save(ticket);
    }

    // 🔹 Update status
    public Ticket updateStatus(Long ticketId, String status) {
        Ticket ticket = ticketRepository.findById(ticketId).orElseThrow();
        ticket.setStatus(status);
        return ticketRepository.save(ticket);
    }
}

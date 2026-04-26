package com.smartcampus.smart_campus_api.service;

import com.smartcampus.smart_campus_api.dto.TicketAnalyticsResponse;
import com.smartcampus.smart_campus_api.dto.TicketResponse;
import com.smartcampus.smart_campus_api.entity.Ticket;
import com.smartcampus.smart_campus_api.repository.TicketRepository;
import com.smartcampus.smart_campus_api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    // Create Ticket
    public Ticket createTicket(Ticket ticket) {
        LocalDateTime now = LocalDateTime.now();

        ticket.setStatus("OPEN");
        ticket.setCreatedAt(now);
        ticket.setFirstResponseAt(null);
        ticket.setResolvedAt(null);

        String priority = ticket.getPriority();

        if (priority != null) {
            switch (priority.trim().toUpperCase()) {
                case "HIGH":
                    ticket.setDueAt(now.plusDays(1));
                    break;
                case "MEDIUM":
                    ticket.setDueAt(now.plusDays(2));
                    break;
                case "LOW":
                    ticket.setDueAt(now.plusDays(5));
                    break;
                default:
                    ticket.setDueAt(now.plusDays(5));
                    break;
            }
        } else {
            ticket.setDueAt(now.plusDays(5));
        }

        Ticket savedTicket = ticketRepository.save(ticket);

        if (savedTicket.getCreatedByRole() != null && ("STUDENT".equalsIgnoreCase(savedTicket.getCreatedByRole()) || "LECTURER".equalsIgnoreCase(savedTicket.getCreatedByRole()))) {
            String roleStr = "STUDENT".equalsIgnoreCase(savedTicket.getCreatedByRole()) ? "Student" : "Lecturer";
            if (savedTicket.getCreatedByEmail() != null) {
                userRepository.findByEmail(savedTicket.getCreatedByEmail()).ifPresent(user -> {
                String userName = ((user.getFirstName() != null ? user.getFirstName() : "") + " " + (user.getLastName() != null ? user.getLastName() : "")).trim();
                if (userName.isEmpty()) userName = "User";
                String title = "New Ticket Submitted";
                String message = userName + " (" + roleStr + ") submitted a new ticket: " + savedTicket.getTitle();
                String actionUrl = "/admin/tickets";

                notificationService.createSystemNotificationForAdmins(title, message, "TICKET", actionUrl);
            });
            }
        }

        return savedTicket;
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    // Get tickets by student/lecturer email (raw entity if needed internally)
    public List<Ticket> getTicketsByUser(String email) {
        return ticketRepository.findByCreatedByEmail(email);
    }

    // Get tickets assigned to technician (raw entity if needed internally)
    public List<Ticket> getTicketsForTechnician(String email) {
        return ticketRepository.findByTechnicianEmail(email);
    }

    // Assign technician
    public Ticket assignTechnician(Long ticketId, String technicianEmail) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found"));

        ticket.setTechnicianEmail(technicianEmail);
        ticket.setStatus("IN_PROGRESS");

        if (ticket.getFirstResponseAt() == null) {
            ticket.setFirstResponseAt(LocalDateTime.now());
        }

        Ticket savedTicket = ticketRepository.save(ticket);
        
        if (ticket.getCreatedByEmail() != null) {
            userRepository.findByEmail(ticket.getCreatedByEmail()).ifPresent(user -> {
                String title = "Ticket Assigned";
                String message = "Your ticket '" + ticket.getTitle() + "' has been assigned to a technician and is now IN_PROGRESS.";
                String actionUrl = "LECTURER".equalsIgnoreCase(user.getRole()) ? "/lecturer/tickets" : "/student/tickets";
                notificationService.createSystemNotification(user.getId(), title, message, actionUrl);
            });
        }

        return savedTicket;
    }

    // Update status
    public Ticket updateStatus(Long ticketId, String status) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found"));

        if (status == null || status.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Status is required");
        }

        String normalizedStatus = status.trim().toUpperCase();
        ticket.setStatus(normalizedStatus);

        if ("IN_PROGRESS".equals(normalizedStatus) && ticket.getFirstResponseAt() == null) {
            ticket.setFirstResponseAt(LocalDateTime.now());
        }

        if ("RESOLVED".equals(normalizedStatus) && ticket.getResolvedAt() == null) {
            ticket.setResolvedAt(LocalDateTime.now());
        }

        Ticket savedTicket = ticketRepository.save(ticket);
        
        if (ticket.getCreatedByEmail() != null) {
            userRepository.findByEmail(ticket.getCreatedByEmail()).ifPresent(user -> {
                String title = "Ticket Status Updated";
                String message = "Your ticket '" + ticket.getTitle() + "' status has been updated to " + normalizedStatus + ".";
                String actionUrl = "LECTURER".equalsIgnoreCase(user.getRole()) ? "/lecturer/tickets" : "/student/tickets";
                notificationService.createSystemNotification(user.getId(), title, message, actionUrl);
            });
        }

        return savedTicket;
    }

    // Edit ticket -> only when status is OPEN
    public Ticket updateTicket(Long ticketId, Ticket updatedTicket) {
        Ticket existingTicket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found"));

        String currentStatus = existingTicket.getStatus() == null
                ? ""
                : existingTicket.getStatus().trim().toUpperCase();

        if (!"OPEN".equals(currentStatus)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Ticket can only be edited when status is OPEN"
            );
        }

        // Only editable business fields
        existingTicket.setTitle(updatedTicket.getTitle());
        existingTicket.setDescription(updatedTicket.getDescription());
        existingTicket.setCategory(updatedTicket.getCategory());
        existingTicket.setPriority(updatedTicket.getPriority());
        existingTicket.setBuilding(updatedTicket.getBuilding());
        existingTicket.setRoom(updatedTicket.getRoom());

        // Do NOT allow student edit of these through this endpoint:
        // status, technicianEmail, createdAt, firstResponseAt, resolvedAt, dueAt,
        // createdByEmail, createdById, createdByRole

        return ticketRepository.save(existingTicket);
    }

    // -----------------------------
    // SLA HELPER METHODS
    // -----------------------------

    public String getSlaStatus(Ticket ticket) {
        if (ticket == null) {
            return "UNKNOWN";
        }

        if (ticket.getResolvedAt() != null) {
            return "COMPLETED";
        }

        if (ticket.getDueAt() == null) {
            return "UNKNOWN";
        }

        LocalDateTime now = LocalDateTime.now();

        if (now.isAfter(ticket.getDueAt())) {
            return "OVERDUE";
        }

        if (now.isAfter(ticket.getDueAt().minusHours(12))) {
            return "DUE_SOON";
        }

        return "ON_TIME";
    }

    public String getResponseTime(Ticket ticket) {
        if (ticket == null || ticket.getCreatedAt() == null || ticket.getFirstResponseAt() == null) {
            return "N/A";
        }

        Duration duration = Duration.between(ticket.getCreatedAt(), ticket.getFirstResponseAt());
        long hours = duration.toHours();
        long minutes = duration.toMinutes() % 60;

        return hours + "h " + minutes + "m";
    }

    public String getResolutionTime(Ticket ticket) {
        if (ticket == null || ticket.getCreatedAt() == null || ticket.getResolvedAt() == null) {
            return "N/A";
        }

        Duration duration = Duration.between(ticket.getCreatedAt(), ticket.getResolvedAt());
        long hours = duration.toHours();
        long minutes = duration.toMinutes() % 60;

        return hours + "h " + minutes + "m";
    }

    // -----------------------------
    // DTO MAPPING METHODS
    // -----------------------------

    public TicketResponse mapToResponse(Ticket ticket) {
        TicketResponse response = new TicketResponse();

        response.setId(ticket.getId());
        response.setTitle(ticket.getTitle());
        response.setDescription(ticket.getDescription());
        response.setCategory(ticket.getCategory());
        response.setPriority(ticket.getPriority());
        response.setStatus(ticket.getStatus());
        response.setBuilding(ticket.getBuilding());
        response.setRoom(ticket.getRoom());
        response.setCreatedByEmail(ticket.getCreatedByEmail());
        response.setCreatedById(ticket.getCreatedById());
        response.setCreatedByRole(ticket.getCreatedByRole());
        response.setTechnicianEmail(ticket.getTechnicianEmail());

        response.setCreatedAt(ticket.getCreatedAt());
        response.setFirstResponseAt(ticket.getFirstResponseAt());
        response.setResolvedAt(ticket.getResolvedAt());
        response.setDueAt(ticket.getDueAt());

        response.setSlaStatus(getSlaStatus(ticket));
        response.setResponseTime(getResponseTime(ticket));
        response.setResolutionTime(getResolutionTime(ticket));

        return response;
    }

    public List<TicketResponse> getAllTicketResponses() {
        return ticketRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<TicketResponse> getTicketResponsesByUser(String email) {
        return ticketRepository.findByCreatedByEmail(email)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<TicketResponse> getTicketResponsesForTechnician(String email) {
        return ticketRepository.findByTechnicianEmail(email)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // -----------------------------
    // ANALYTICS METHODS
    // -----------------------------

    public TicketAnalyticsResponse getTicketAnalyticsSummary() {
        List<Ticket> tickets = ticketRepository.findAll();

        TicketAnalyticsResponse response = new TicketAnalyticsResponse();

        long totalTickets = tickets.size();
        long overdueTickets = 0;
        long completedTickets = 0;
        long onTimeTickets = 0;

        long totalResponseMinutes = 0;
        long responseCount = 0;

        long totalResolutionMinutes = 0;
        long resolutionCount = 0;

        for (Ticket ticket : tickets) {
            String slaStatus = getSlaStatus(ticket);

            if ("OVERDUE".equals(slaStatus)) {
                overdueTickets++;
            }

            if ("COMPLETED".equals(slaStatus)) {
                completedTickets++;
            }

            if ("ON_TIME".equals(slaStatus)) {
                onTimeTickets++;
            }

            if (ticket.getCreatedAt() != null && ticket.getFirstResponseAt() != null) {
                long responseMinutes = Duration.between(
                        ticket.getCreatedAt(),
                        ticket.getFirstResponseAt()
                ).toMinutes();

                totalResponseMinutes += responseMinutes;
                responseCount++;
            }

            if (ticket.getCreatedAt() != null && ticket.getResolvedAt() != null) {
                long resolutionMinutes = Duration.between(
                        ticket.getCreatedAt(),
                        ticket.getResolvedAt()
                ).toMinutes();

                totalResolutionMinutes += resolutionMinutes;
                resolutionCount++;
            }
        }

        response.setTotalTickets(totalTickets);
        response.setOverdueTickets(overdueTickets);
        response.setCompletedTickets(completedTickets);
        response.setOnTimeTickets(onTimeTickets);

        if (responseCount > 0) {
            long avgResponseMinutes = totalResponseMinutes / responseCount;
            response.setAverageResponseTime(formatMinutes(avgResponseMinutes));
        } else {
            response.setAverageResponseTime("N/A");
        }

        if (resolutionCount > 0) {
            long avgResolutionMinutes = totalResolutionMinutes / resolutionCount;
            response.setAverageResolutionTime(formatMinutes(avgResolutionMinutes));
        } else {
            response.setAverageResolutionTime("N/A");
        }

        return response;
    }

    private String formatMinutes(long totalMinutes) {
        long hours = totalMinutes / 60;
        long minutes = totalMinutes % 60;
        return hours + "h " + minutes + "m";
    }
}
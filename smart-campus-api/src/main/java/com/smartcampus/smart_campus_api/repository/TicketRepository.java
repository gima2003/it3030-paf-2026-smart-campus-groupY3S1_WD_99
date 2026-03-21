package com.smartcampus.smart_campus_api.repository;

import com.smartcampus.smart_campus_api.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    // 🔹 Get tickets by creator (student/lecturer)
    List<Ticket> findByCreatedByEmail(String email);

    // 🔹 Get tickets assigned to technician
    List<Ticket> findByTechnicianEmail(String email);
}

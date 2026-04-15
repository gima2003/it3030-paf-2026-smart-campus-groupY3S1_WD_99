package com.smartcampus.smart_campus_api.repository;

import com.smartcampus.smart_campus_api.entity.Booking;
import com.smartcampus.smart_campus_api.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUser_Id(Long userId);

    List<Booking> findByStatus(BookingStatus status);

    List<Booking> findByBookingDate(LocalDate bookingDate);

    List<Booking> findByFacility_IdAndBookingDate(Long facilityId, LocalDate bookingDate);

    List<Booking> findByEquipment_IdAndBookingDate(Long equipmentId, LocalDate bookingDate);

    List<Booking> findByFacility_IdAndBookingDateAndStatusIn(
            Long facilityId,
            LocalDate bookingDate,
            List<BookingStatus> statuses
    );

    List<Booking> findByEquipment_IdAndBookingDateAndStatusIn(
            Long equipmentId,
            LocalDate bookingDate,
            List<BookingStatus> statuses
    );
}
package com.smartcampus.smart_campus_api.controller;

import com.smartcampus.smart_campus_api.dto.BookingDecisionDto;
import com.smartcampus.smart_campus_api.dto.BookingRequestDto;
import com.smartcampus.smart_campus_api.dto.BookingResponseDto;
import com.smartcampus.smart_campus_api.dto.AvailabilityCheckRequestDto;
import com.smartcampus.smart_campus_api.dto.AvailabilityCheckResponseDto;
import com.smartcampus.smart_campus_api.service.BookingService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // CREATE → 201
    @PostMapping
    public ResponseEntity<BookingResponseDto> createBooking(@RequestBody BookingRequestDto requestDto) {
        BookingResponseDto response = bookingService.createBooking(requestDto);
        return ResponseEntity.status(201).body(response); // 201 CREATED
    }

    // CHECK AVAILABILITY → 200
    @PostMapping("/check-availability")
    public ResponseEntity<AvailabilityCheckResponseDto> checkAvailability(
            @RequestBody AvailabilityCheckRequestDto requestDto
    ) {
        return ResponseEntity.status(200).body(
                bookingService.checkAvailability(requestDto)
        ); // 200 OK
    }

    // GET ALL → 200 / 404
    @GetMapping
    public ResponseEntity<List<BookingResponseDto>> getAllBookings() {
        List<BookingResponseDto> bookings = bookingService.getAllBookings();

        if (bookings.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No bookings found"); // 404
        }

        return ResponseEntity.status(200).body(bookings); // 200 OK
    }

    // GET BY USER → 200 / 404
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingResponseDto>> getBookingsByUser(@PathVariable Long userId) {
        List<BookingResponseDto> bookings = bookingService.getBookingsByUser(userId);

        if (bookings.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No bookings found for this user"); // 404
        }

        return ResponseEntity.status(200).body(bookings); 
    }

    // APPROVE → 200
    @PutMapping("/{bookingId}/approve")
    public ResponseEntity<BookingResponseDto> approveBooking(
            @PathVariable Long bookingId,
            @RequestBody(required = false) BookingDecisionDto decisionDto
    ) {
        return ResponseEntity.status(200).body(
                bookingService.approveBooking(bookingId, decisionDto)
        ); // 200 OK
    }

    // REJECT → 200
    @PutMapping("/{bookingId}/reject")
    public ResponseEntity<BookingResponseDto> rejectBooking(
            @PathVariable Long bookingId,
            @RequestBody(required = false) BookingDecisionDto decisionDto
    ) {
        return ResponseEntity.status(200).body(
                bookingService.rejectBooking(bookingId, decisionDto)
        ); // 200 OK
    }

    // CANCEL → 200
    @PutMapping("/{bookingId}/cancel")
    public ResponseEntity<BookingResponseDto> cancelBooking(
            @PathVariable Long bookingId,
            @RequestBody(required = false) BookingDecisionDto decisionDto
    ) {
        return ResponseEntity.status(200).body(
                bookingService.cancelBooking(bookingId, decisionDto)
        ); // 200 OK
    }

    // DELETE → 204
    @DeleteMapping("/{bookingId}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long bookingId) {
        bookingService.deleteBooking(bookingId);
        return ResponseEntity.status(204).build(); 
    }
}
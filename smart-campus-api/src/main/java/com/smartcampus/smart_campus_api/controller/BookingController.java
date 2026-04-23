package com.smartcampus.smart_campus_api.controller;

import com.smartcampus.smart_campus_api.dto.BookingDecisionDto;
import com.smartcampus.smart_campus_api.dto.BookingRequestDto;
import com.smartcampus.smart_campus_api.dto.BookingResponseDto;
import com.smartcampus.smart_campus_api.service.BookingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.smartcampus.smart_campus_api.dto.AvailabilityCheckRequestDto;
import com.smartcampus.smart_campus_api.dto.AvailabilityCheckResponseDto;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingResponseDto> createBooking(@RequestBody BookingRequestDto requestDto) {
        BookingResponseDto response = bookingService.createBooking(requestDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/check-availability")
    public ResponseEntity<AvailabilityCheckResponseDto> checkAvailability(
            @RequestBody AvailabilityCheckRequestDto requestDto
    ) {
        return ResponseEntity.ok(bookingService.checkAvailability(requestDto));
    }

    @GetMapping
    public ResponseEntity<List<BookingResponseDto>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingResponseDto>> getBookingsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getBookingsByUser(userId));
    }

    @PutMapping("/{bookingId}/approve")
    public ResponseEntity<BookingResponseDto> approveBooking(
            @PathVariable Long bookingId,
            @RequestBody(required = false) BookingDecisionDto decisionDto
    ) {
        return ResponseEntity.ok(bookingService.approveBooking(bookingId, decisionDto));
    }

    @PutMapping("/{bookingId}/reject")
    public ResponseEntity<BookingResponseDto> rejectBooking(
            @PathVariable Long bookingId,
            @RequestBody(required = false) BookingDecisionDto decisionDto
    ) {
        return ResponseEntity.ok(bookingService.rejectBooking(bookingId, decisionDto));
    }

    @PutMapping("/{bookingId}/cancel")
    public ResponseEntity<BookingResponseDto> cancelBooking(
            @PathVariable Long bookingId,
            @RequestBody(required = false) BookingDecisionDto decisionDto
    ) {
        return ResponseEntity.ok(bookingService.cancelBooking(bookingId, decisionDto));
    }

    @DeleteMapping("/{bookingId}")
    public ResponseEntity<String> deleteBooking(@PathVariable Long bookingId) {
        bookingService.deleteBooking(bookingId);
        return ResponseEntity.ok("Booking deleted successfully");
    }
}
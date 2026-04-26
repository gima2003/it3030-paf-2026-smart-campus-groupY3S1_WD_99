package com.smartcampus.smart_campus_api.service;

import com.smartcampus.smart_campus_api.dto.BookingDecisionDto;
import com.smartcampus.smart_campus_api.dto.BookingRequestDto;
import com.smartcampus.smart_campus_api.dto.BookingResponseDto;
import com.smartcampus.smart_campus_api.dto.AvailabilityCheckRequestDto;
import com.smartcampus.smart_campus_api.dto.AvailabilityCheckResponseDto;

import java.util.List;

public interface BookingService {

    BookingResponseDto createBooking(BookingRequestDto requestDto);

    List<BookingResponseDto> getAllBookings();

    List<BookingResponseDto> getBookingsByUser(Long userId);

    BookingResponseDto approveBooking(Long bookingId, BookingDecisionDto decisionDto);

    BookingResponseDto rejectBooking(Long bookingId, BookingDecisionDto decisionDto);

    BookingResponseDto cancelBooking(Long bookingId, BookingDecisionDto decisionDto);

    AvailabilityCheckResponseDto checkAvailability(AvailabilityCheckRequestDto requestDto);

    void deleteBooking(Long bookingId);
}
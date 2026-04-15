package com.smartcampus.smart_campus_api.service.impl;

import com.smartcampus.smart_campus_api.dto.BookingDecisionDto;
import com.smartcampus.smart_campus_api.dto.BookingRequestDto;
import com.smartcampus.smart_campus_api.dto.BookingResponseDto;
import com.smartcampus.smart_campus_api.entity.*;
import com.smartcampus.smart_campus_api.entity.Resource_enum.AssetStatus;
import com.smartcampus.smart_campus_api.repository.BookingRepository;
import com.smartcampus.smart_campus_api.repository.EquipmentRepository;
import com.smartcampus.smart_campus_api.repository.FacilityRepository;
import com.smartcampus.smart_campus_api.repository.UserRepository;
import com.smartcampus.smart_campus_api.service.BookingService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final FacilityRepository facilityRepository;
    private final EquipmentRepository equipmentRepository;

    public BookingServiceImpl(
            BookingRepository bookingRepository,
            UserRepository userRepository,
            FacilityRepository facilityRepository,
            EquipmentRepository equipmentRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.facilityRepository = facilityRepository;
        this.equipmentRepository = equipmentRepository;
    }

    @Override
    public BookingResponseDto createBooking(BookingRequestDto requestDto) {
        validateBookingRequest(requestDto);

        User user = userRepository.findById(requestDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setResourceType(requestDto.getResourceType());
        booking.setBookingDate(requestDto.getBookingDate());
        booking.setStartTime(requestDto.getStartTime());
        booking.setEndTime(requestDto.getEndTime());
        booking.setPurpose(requestDto.getPurpose());
        booking.setAttendees(requestDto.getAttendees());
        booking.setStatus(BookingStatus.PENDING);

        if (requestDto.getResourceType() == BookingResourceType.FACILITY) {
            Facility facility = facilityRepository.findById(requestDto.getFacilityId())
                    .orElseThrow(() -> new RuntimeException("Facility not found"));

            if (facility.getStatus() != AssetStatus.ACTIVE) {
                throw new RuntimeException("Facility is not active");
            }

            if (Boolean.FALSE.equals(facility.getIsBookable())) {
                throw new RuntimeException("Facility is not bookable");
            }

            if (requestDto.getAttendees() != null
                    && facility.getCapacity() != null
                    && requestDto.getAttendees() > facility.getCapacity()) {
                throw new RuntimeException("Attendees exceed facility capacity");
            }

            validateFacilityConflict(
                    requestDto.getFacilityId(),
                    requestDto.getBookingDate(),
                    requestDto.getStartTime(),
                    requestDto.getEndTime()
            );

            booking.setFacility(facility);
            booking.setEquipment(null);

        } else if (requestDto.getResourceType() == BookingResourceType.EQUIPMENT) {
            Equipment equipment = equipmentRepository.findById(requestDto.getEquipmentId())
                    .orElseThrow(() -> new RuntimeException("Equipment not found"));

            if (equipment.getStatus() != AssetStatus.ACTIVE) {
                throw new RuntimeException("Equipment is not active");
            }

            if (Boolean.FALSE.equals(equipment.getIsBookable())) {
                throw new RuntimeException("Equipment is not bookable");
            }

            validateEquipmentConflict(
                    requestDto.getEquipmentId(),
                    requestDto.getBookingDate(),
                    requestDto.getStartTime(),
                    requestDto.getEndTime()
            );

            booking.setEquipment(equipment);
            booking.setFacility(null);
        }

        return mapToDto(bookingRepository.save(booking));
    }

    @Override
    public List<BookingResponseDto> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponseDto> getBookingsByUser(Long userId) {
        return bookingRepository.findByUser_Id(userId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public BookingResponseDto approveBooking(Long bookingId, BookingDecisionDto decisionDto) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only pending bookings can be approved");
        }

        if (booking.getResourceType() == BookingResourceType.FACILITY && booking.getFacility() != null) {
            validateFacilityConflictForApproval(
                    booking.getFacility().getId(),
                    booking.getBookingDate(),
                    booking.getStartTime(),
                    booking.getEndTime(),
                    booking.getId()
            );
        }

        if (booking.getResourceType() == BookingResourceType.EQUIPMENT && booking.getEquipment() != null) {
            validateEquipmentConflictForApproval(
                    booking.getEquipment().getId(),
                    booking.getBookingDate(),
                    booking.getStartTime(),
                    booking.getEndTime(),
                    booking.getId()
            );
        }

        booking.setStatus(BookingStatus.APPROVED);
        booking.setAdminReason(decisionDto != null ? decisionDto.getReason() : null);

        return mapToDto(bookingRepository.save(booking));
    }

    @Override
    public BookingResponseDto rejectBooking(Long bookingId, BookingDecisionDto decisionDto) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only pending bookings can be rejected");
        }

        booking.setStatus(BookingStatus.REJECTED);
        booking.setAdminReason(decisionDto != null ? decisionDto.getReason() : null);

        return mapToDto(bookingRepository.save(booking));
    }

    @Override
    public BookingResponseDto cancelBooking(Long bookingId, BookingDecisionDto decisionDto) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new RuntimeException("Only approved bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setAdminReason(decisionDto != null ? decisionDto.getReason() : null);

        return mapToDto(bookingRepository.save(booking));
    }

    private void validateBookingRequest(BookingRequestDto requestDto) {
        if (requestDto.getUserId() == null) {
            throw new RuntimeException("userId is required");
        }

        if (requestDto.getResourceType() == null) {
            throw new RuntimeException("resourceType is required");
        }

        if (requestDto.getBookingDate() == null) {
            throw new RuntimeException("bookingDate is required");
        }

        if (requestDto.getStartTime() == null || requestDto.getEndTime() == null) {
            throw new RuntimeException("startTime and endTime are required");
        }

        if (!requestDto.getEndTime().isAfter(requestDto.getStartTime())) {
            throw new RuntimeException("endTime must be after startTime");
        }

        if (requestDto.getPurpose() == null || requestDto.getPurpose().trim().isEmpty()) {
            throw new RuntimeException("purpose is required");
        }

        if (requestDto.getResourceType() == BookingResourceType.FACILITY) {
            if (requestDto.getFacilityId() == null) {
                throw new RuntimeException("facilityId is required for facility booking");
            }
            if (requestDto.getEquipmentId() != null) {
                throw new RuntimeException("equipmentId must be null for facility booking");
            }
        }

        if (requestDto.getResourceType() == BookingResourceType.EQUIPMENT) {
            if (requestDto.getEquipmentId() == null) {
                throw new RuntimeException("equipmentId is required for equipment booking");
            }
            if (requestDto.getFacilityId() != null) {
                throw new RuntimeException("facilityId must be null for equipment booking");
            }
        }
    }

    private void validateFacilityConflict(Long facilityId, LocalDate bookingDate, LocalTime start, LocalTime end) {
        List<BookingStatus> statuses = Arrays.asList(BookingStatus.PENDING, BookingStatus.APPROVED);

        List<Booking> existingBookings = bookingRepository.findByFacility_IdAndBookingDateAndStatusIn(
                facilityId, bookingDate, statuses
        );

        boolean hasConflict = existingBookings.stream().anyMatch(existing ->
                requestOverlaps(start, end, existing.getStartTime(), existing.getEndTime())
        );

        if (hasConflict) {
            throw new RuntimeException("Booking conflict detected for this facility and time range");
        }
    }

    private void validateEquipmentConflict(Long equipmentId, LocalDate bookingDate, LocalTime start, LocalTime end) {
        List<BookingStatus> statuses = Arrays.asList(BookingStatus.PENDING, BookingStatus.APPROVED);

        List<Booking> existingBookings = bookingRepository.findByEquipment_IdAndBookingDateAndStatusIn(
                equipmentId, bookingDate, statuses
        );

        boolean hasConflict = existingBookings.stream().anyMatch(existing ->
                requestOverlaps(start, end, existing.getStartTime(), existing.getEndTime())
        );

        if (hasConflict) {
            throw new RuntimeException("Booking conflict detected for this equipment and time range");
        }
    }

    private void validateFacilityConflictForApproval(Long facilityId, LocalDate bookingDate, LocalTime start, LocalTime end, Long bookingId) {
        List<BookingStatus> statuses = Arrays.asList(BookingStatus.PENDING, BookingStatus.APPROVED);

        List<Booking> existingBookings = bookingRepository.findByFacility_IdAndBookingDateAndStatusIn(
                facilityId, bookingDate, statuses
        );

        boolean hasConflict = existingBookings.stream()
                .filter(existing -> !existing.getId().equals(bookingId))
                .anyMatch(existing ->
                        requestOverlaps(start, end, existing.getStartTime(), existing.getEndTime())
                );

        if (hasConflict) {
            throw new RuntimeException("Cannot approve because facility has a conflicting booking");
        }
    }

    private void validateEquipmentConflictForApproval(Long equipmentId, LocalDate bookingDate, LocalTime start, LocalTime end, Long bookingId) {
        List<BookingStatus> statuses = Arrays.asList(BookingStatus.PENDING, BookingStatus.APPROVED);

        List<Booking> existingBookings = bookingRepository.findByEquipment_IdAndBookingDateAndStatusIn(
                equipmentId, bookingDate, statuses
        );

        boolean hasConflict = existingBookings.stream()
                .filter(existing -> !existing.getId().equals(bookingId))
                .anyMatch(existing ->
                        requestOverlaps(start, end, existing.getStartTime(), existing.getEndTime())
                );

        if (hasConflict) {
            throw new RuntimeException("Cannot approve because equipment has a conflicting booking");
        }
    }

    private boolean requestOverlaps(LocalTime newStart, LocalTime newEnd, LocalTime existingStart, LocalTime existingEnd) {
        return newStart.isBefore(existingEnd) && newEnd.isAfter(existingStart);
    }

    private BookingResponseDto mapToDto(Booking booking) {
        BookingResponseDto dto = new BookingResponseDto();

        dto.setId(booking.getId());

        if (booking.getUser() != null) {
            dto.setUserId(booking.getUser().getId());
            String firstName = booking.getUser().getFirstName() != null ? booking.getUser().getFirstName() : "";
            String lastName = booking.getUser().getLastName() != null ? booking.getUser().getLastName() : "";
            dto.setUserName((firstName + " " + lastName).trim());
        }

        dto.setResourceType(booking.getResourceType());

        if (booking.getFacility() != null) {
            dto.setFacilityId(booking.getFacility().getId());
            dto.setFacilityName(booking.getFacility().getName());
        }

        if (booking.getEquipment() != null) {
            dto.setEquipmentId(booking.getEquipment().getId());
            dto.setEquipmentName(booking.getEquipment().getName());
        }

        dto.setBookingDate(booking.getBookingDate());
        dto.setStartTime(booking.getStartTime());
        dto.setEndTime(booking.getEndTime());
        dto.setPurpose(booking.getPurpose());
        dto.setAttendees(booking.getAttendees());
        dto.setStatus(booking.getStatus());
        dto.setAdminReason(booking.getAdminReason());
        dto.setCreatedAt(booking.getCreatedAt());
        dto.setUpdatedAt(booking.getUpdatedAt());

        return dto;
    }
}
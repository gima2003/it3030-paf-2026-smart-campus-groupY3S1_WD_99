package com.smartcampus.smart_campus_api.dto;

import java.util.List;

public class AvailabilityCheckResponseDto {

    private boolean available;
    private String message;
    private List<TimeSlotSuggestionDto> suggestions;

    public AvailabilityCheckResponseDto() {
    }

    public AvailabilityCheckResponseDto(boolean available, String message) {
        this.available = available;
        this.message = message;
    }

    public AvailabilityCheckResponseDto(boolean available, String message, List<TimeSlotSuggestionDto> suggestions) {
        this.available = available;
        this.message = message;
        this.suggestions = suggestions;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<TimeSlotSuggestionDto> getSuggestions() {
        return suggestions;
    }

    public void setSuggestions(List<TimeSlotSuggestionDto> suggestions) {
        this.suggestions = suggestions;
    }
}
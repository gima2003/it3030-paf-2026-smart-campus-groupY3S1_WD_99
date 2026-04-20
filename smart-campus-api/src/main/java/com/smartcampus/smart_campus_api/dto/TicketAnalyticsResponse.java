package com.smartcampus.smart_campus_api.dto;

public class TicketAnalyticsResponse {

    private long totalTickets;
    private long overdueTickets;
    private long completedTickets;
    private long onTimeTickets;

    private String averageResponseTime;
    private String averageResolutionTime;

    public TicketAnalyticsResponse() {
    }

    public long getTotalTickets() {
        return totalTickets;
    }

    public void setTotalTickets(long totalTickets) {
        this.totalTickets = totalTickets;
    }

    public long getOverdueTickets() {
        return overdueTickets;
    }

    public void setOverdueTickets(long overdueTickets) {
        this.overdueTickets = overdueTickets;
    }

    public long getCompletedTickets() {
        return completedTickets;
    }

    public void setCompletedTickets(long completedTickets) {
        this.completedTickets = completedTickets;
    }

    public long getOnTimeTickets() {
        return onTimeTickets;
    }

    public void setOnTimeTickets(long onTimeTickets) {
        this.onTimeTickets = onTimeTickets;
    }

    public String getAverageResponseTime() {
        return averageResponseTime;
    }

    public void setAverageResponseTime(String averageResponseTime) {
        this.averageResponseTime = averageResponseTime;
    }

    public String getAverageResolutionTime() {
        return averageResolutionTime;
    }

    public void setAverageResolutionTime(String averageResolutionTime) {
        this.averageResolutionTime = averageResolutionTime;
    }
}

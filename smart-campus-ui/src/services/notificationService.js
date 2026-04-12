import axios from 'axios';

const API_URL = 'http://localhost:8081/api';

const getAuthHeaders = () => {
    return {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    };
};

export const notificationService = {
    // Admin Endpoints
    createNotification: async (data) => {
        const response = await axios.post(`${API_URL}/admin/notifications`, data, getAuthHeaders());
        return response.data;
    },
    getAllAdminNotifications: async () => {
        const response = await axios.get(`${API_URL}/admin/notifications`, getAuthHeaders());
        return response.data;
    },
    expireNotification: async (id) => {
        const response = await axios.patch(`${API_URL}/admin/notifications/${id}/expire`, {}, getAuthHeaders());
        return response.data;
    },
    resendNotification: async (id) => {
        const response = await axios.post(`${API_URL}/admin/notifications/${id}/resend`, {}, getAuthHeaders());
        return response.data;
    },

    // User Endpoints
    getUserNotifications: async () => {
        const response = await axios.get(`${API_URL}/notifications`, getAuthHeaders());
        return response.data;
    },
    getUnreadCount: async () => {
        const response = await axios.get(`${API_URL}/notifications/unread-count`, getAuthHeaders());
        return response.data;
    },
    markAsRead: async (id) => {
        const response = await axios.patch(`${API_URL}/notifications/${id}/read`, {}, getAuthHeaders());
        return response.data;
    },
    markAllAsRead: async () => {
        const response = await axios.patch(`${API_URL}/notifications/mark-all-read`, {}, getAuthHeaders());
        return response.data;
    },
    deleteNotification: async (id) => {
        const response = await axios.delete(`${API_URL}/notifications/${id}`, getAuthHeaders());
        return response.data;
    }
};

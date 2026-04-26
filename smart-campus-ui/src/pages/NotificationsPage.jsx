import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import { useToast } from '../context/ToastContext';
import { FaTrash, FaCheckDouble } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { timeAgo } from '../utils/timeAgo';

function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState('ALL');
    const { showToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications();

        const handleUpdateEvent = () => fetchNotifications();
        window.addEventListener("notificationsUpdated", handleUpdateEvent);

        return () => window.removeEventListener("notificationsUpdated", handleUpdateEvent);
    }, []);

    const fetchNotifications = async () => {
        try {
            const list = await notificationService.getUserNotifications();
            setNotifications(list);
        } catch (err) {
            showToast("Failed to fetch notifications", "error");
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            fetchNotifications();
        } catch (err) {
            showToast("Failed to mark as read", "error");
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationService.markAllAsRead();
            showToast("All marked as read", "success");
            fetchNotifications();
        } catch (err) {
            showToast("Failed to mark all as read", "error");
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        try {
            await notificationService.deleteNotification(id);
            showToast("Notification deleted", "success");
            fetchNotifications();
        } catch (err) {
            showToast("Failed to delete notification", "error");
        }
    };

    const handleNotificationClick = async (notif) => {
        if (!notif.isRead) {
            await notificationService.markAsRead(notif.id);
        }
        if (notif.actionUrl) {
            if (notif.actionUrl.startsWith("http")) {
                window.open(notif.actionUrl, "_blank");
            } else {
                navigate(notif.actionUrl);
            }
        } else {
            fetchNotifications();
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
          case "WARNING": return "text-red-500 border-red-500/20 bg-red-500/10";
          case "SYSTEM": return "text-purple-500 border-purple-500/20 bg-purple-500/10";
          case "REMINDER": return "text-yellow-500 border-yellow-500/20 bg-yellow-500/10";
          case "ANNOUNCEMENT": return "text-blue-500 border-blue-500/20 bg-blue-500/10";
          default: return "text-green-500 border-green-500/20 bg-green-500/10";
        }
    };

    const filtered = notifications.filter(n => filter === 'ALL' || (filter === 'UNREAD' && !n.isRead));

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Notifications</h1>
                <div className="flex gap-4">
                    <select 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-[#001736] text-white border border-white/10 rounded-lg px-4 py-2 focus:outline-none"
                    >
                        <option value="ALL">All Notifications</option>
                        <option value="UNREAD">Unread Only</option>
                    </select>
                    <button 
                        onClick={handleMarkAllRead}
                        className="flex items-center gap-2 bg-[#0A6ED3] text-white px-4 py-2 rounded-lg hover:bg-[#0855A6] transition"
                    >
                        <FaCheckDouble /> Mark All Read
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {filtered.length === 0 ? (
                    <div className="text-center text-gray-400 py-12 bg-[#001736] rounded-xl border border-white/5">
                        No notifications found.
                    </div>
                ) : (
                    filtered.map(notif => (
                        <div 
                            key={notif.id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`p-5 rounded-xl border cursor-pointer transition ${
                                notif.isRead 
                                ? 'bg-[#001229] border-white/5 hover:bg-[#001736]' 
                                : 'bg-[#001D4A] border-[#0A6ED3]/30 hover:bg-[#002663]'
                            }`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`text-xs px-2 py-1 rounded border font-medium uppercase ${getTypeColor(notif.type)}`}>
                                        {notif.type}
                                    </span>
                                    {notif.pinned && (
                                        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded border border-red-500/20">
                                            📌 Pinned
                                        </span>
                                    )}
                                    {!notif.isRead && (
                                        <span className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></span>
                                    )}
                                    <span className="text-sm text-gray-400 ml-2 mt-1">
                                        {timeAgo(notif.createdAt)}
                                    </span>
                                </div>
                                <button 
                                    onClick={(e) => handleDelete(notif.id, e)}
                                    className="text-gray-500 hover:text-red-500 transition p-2"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                            <h3 className={`text-lg mb-1 ${notif.isRead ? 'text-gray-300' : 'text-white font-semibold'}`}>
                                {notif.title}
                            </h3>
                            <p className="text-gray-400">
                                {notif.message}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default NotificationsPage;

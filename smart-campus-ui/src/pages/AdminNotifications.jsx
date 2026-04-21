import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import { useToast } from '../context/ToastContext';
import { FaPlus, FaPaperPlane, FaTimesCircle } from 'react-icons/fa';
import CreateNotificationModal from '../components/CreateNotificationModal';
import Swal from 'sweetalert2';

function AdminNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const list = await notificationService.getAllAdminNotifications();
            setNotifications(list.reverse()); // newest first
        } catch (error) {
            showToast("Failed to load notifications", "error");
        }
    };

    const handleExpire = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure you want to expire this notification?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes"
        });

        if (!result.isConfirmed) return;

        try {
            await notificationService.expireNotification(id);
            showToast("Notification expired", "success");
            fetchNotifications();
        } catch (error) {
            showToast("Failed to expire notification", "error");
        }
    };

    const handleResend = async (id) => {
        if (!window.confirm("Are you sure you want to resend this notification?")) return;
        try {
            await notificationService.resendNotification(id);
            showToast("Notification resent", "success");
            fetchNotifications();
        } catch (error) {
            showToast("Failed to resend notification", "error");
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'SENT': return <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">SENT</span>;
            case 'SCHEDULED': return <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">SCHEDULED</span>;
            case 'EXPIRED': return <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs">EXPIRED</span>;
            default: return <span className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded text-xs">{status}</span>;
        }
    };

    return (
        <div className="p-8 bg-[#000919] min-h-[calc(100vh-64px)] -m-[20px]">
            <div className="flex justify-between items-center mb-6">
                 <div>
                     <h1 className="text-2xl font-bold text-white">Manage Notifications</h1>
                     <p className="text-gray-400 text-sm mt-1">Create and manage alerts across the platform</p>
                 </div>
                 <button 
                     onClick={() => setIsCreateModalOpen(true)}
                     className="bg-[#0A6ED3] hover:bg-[#0855A6] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                 >
                     <FaPlus /> Create Notification
                 </button>
            </div>

            <div className="bg-[#001736] border border-white/5 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm text-gray-300">
                    <thead className="bg-[#001D4A] text-gray-400 uppercase text-xs border-b border-white/5">
                        <tr>
                            <th className="px-6 py-4">Title / Target</th>
                            <th className="px-6 py-4">Type & Priority</th>
                            <th className="px-6 py-4">Dates</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {notifications.map((notif) => (
                            <tr key={notif.id} className="hover:bg-white/5 transition">
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-white mb-1">{notif.title}</div>
                                    <div className="text-xs text-blue-400 mt-1">Target: {notif.targetAudience}</div>
                                    {notif.pinned && <span className="mt-1 inline-block text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500/20">📌 PINNED</span>}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="mb-1 text-gray-300">{notif.type}</div>
                                    <div className={`text-xs font-semibold ${notif.priority === 'HIGH' ? 'text-red-400' : 'text-gray-400'}`}>
                                        {notif.priority}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-xs space-y-1">
                                    <div className="text-gray-400"><span className="text-gray-500">Created:</span> {new Date(notif.createdAt).toLocaleDateString()}</div>
                                    {notif.startDate && <div className="text-gray-400"><span className="text-gray-500">Start:</span> {new Date(notif.startDate).toLocaleDateString()}</div>}
                                    {notif.expiryDate && <div className="text-gray-400"><span className="text-gray-500">Expires:</span> {new Date(notif.expiryDate).toLocaleDateString()}</div>}
                                </td>
                                <td className="px-6 py-4 font-medium">
                                    {getStatusBadge(notif.status)}
                                </td>
                                <td className="px-6 py-4 text-right space-x-4">
                                    {notif.status !== 'EXPIRED' && (
                                        <button 
                                            onClick={() => handleExpire(notif.id)}
                                            className="text-yellow-500 hover:text-yellow-400 transition"
                                            title="Expire"
                                        >
                                            <FaTimesCircle className="inline text-lg" />
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => handleResend(notif.id)}
                                        className="text-[#0A6ED3] hover:text-blue-400 transition"
                                        title="Resend"
                                    >
                                        <FaPaperPlane className="inline text-lg" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {notifications.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                    No notifications created yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <CreateNotificationModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
                onSuccess={fetchNotifications} 
            />
        </div>
    );
}

export default AdminNotifications;

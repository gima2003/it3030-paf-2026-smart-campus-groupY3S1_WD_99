import React, { useState } from 'react';
import { FaTimes, FaRegPaperPlane } from 'react-icons/fa';
import { notificationService } from '../services/notificationService';
import { useToast } from '../context/ToastContext';

function CreateNotificationModal({ isOpen, onClose, onSuccess }) {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        type: 'GENERAL',
        priority: 'MEDIUM',
        targetAudience: 'ALL_USERS',
        specificRole: 'STUDENT',
        specificIdentifier: '',
        actionUrl: '',
        pinned: false,
        startDate: '',
        expiryDate: '',
        sendImmediately: true
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            specificRole: formData.targetAudience === 'SPECIFIC_USER' ? formData.specificRole : null,
            specificIdentifier: formData.targetAudience === 'SPECIFIC_USER' ? formData.specificIdentifier : null,
            startDate: formData.startDate || null,
            expiryDate: formData.expiryDate || null,
        };

        try {
            await notificationService.createNotification(payload);
            showToast("Notification created successfully", "success");
            window.dispatchEvent(new Event("notificationsUpdated"));
            onSuccess();
            onClose();
        } catch (error) {
            showToast("Failed to create notification", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#000919] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[#001736]">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <FaRegPaperPlane className="text-[#0A6ED3]" /> Create Notification
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5 text-sm">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="sm:col-span-2">
                            <label className="block text-gray-400 mb-1.5 font-medium">Notification Title *</label>
                            <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-[#0B1220] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-[#0A6ED3] focus:outline-none" placeholder="Enter title (e.g., System Maintenance)" />
                        </div>
                        
                        <div className="sm:col-span-2">
                            <label className="block text-gray-400 mb-1.5 font-medium">Message *</label>
                            <textarea required rows="3" name="message" value={formData.message} onChange={handleChange} className="w-full bg-[#0B1220] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-[#0A6ED3] focus:outline-none" placeholder="Type notification message..."></textarea>
                        </div>

                        <div>
                            <label className="block text-gray-400 mb-1.5 font-medium">Type *</label>
                            <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-[#0B1220] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-[#0A6ED3] focus:outline-none">
                                <option value="GENERAL">General</option>
                                <option value="ANNOUNCEMENT">Announcement</option>
                                <option value="SYSTEM">System</option>
                                <option value="WARNING">Warning</option>
                                <option value="REMINDER">Reminder</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-400 mb-1.5 font-medium">Priority *</label>
                            <select name="priority" value={formData.priority} onChange={handleChange} className="w-full bg-[#0B1220] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-[#0A6ED3] focus:outline-none">
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-400 mb-1.5 font-medium">Target Audience *</label>
                            <select name="targetAudience" value={formData.targetAudience} onChange={handleChange} className="w-full bg-[#0B1220] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-[#0A6ED3] focus:outline-none">
                                <option value="ALL_USERS">All Users</option>
                                <option value="ALL_STUDENTS">All Students</option>
                                <option value="ALL_TECHNICIANS">All Technicians</option>
                                <option value="ALL_LECTURERS">All Lecturers</option>
                                <option value="ALL_ADMINS">All Admins</option>
                                <option value="SPECIFIC_USER">Specific User ID</option>
                            </select>
                        </div>

                        {formData.targetAudience === 'SPECIFIC_USER' && (
                            <>
                                <div>
                                    <label className="block text-gray-400 mb-1.5 font-medium">Target Role *</label>
                                    <select name="specificRole" value={formData.specificRole} onChange={handleChange} className="w-full bg-[#0B1220] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-[#0A6ED3] focus:outline-none">
                                        <option value="STUDENT">Student</option>
                                        <option value="LECTURER">Lecturer</option>
                                        <option value="TECHNICIAN">Technician</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-1.5 font-medium">
                                        {formData.specificRole === 'STUDENT' ? 'Student ID *' : 'Employee ID *'}
                                    </label>
                                    <input required type="text" name="specificIdentifier" value={formData.specificIdentifier} onChange={handleChange} className="w-full bg-[#0B1220] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-[#0A6ED3] focus:outline-none" placeholder={`Enter ${formData.specificRole === 'STUDENT' ? 'Student ID' : 'Employee ID'}`} />
                                </div>
                            </>
                        )}

                        <div className="sm:col-span-2">
                             <label className="block text-gray-400 mb-1.5 font-medium">Action URL (Optional)</label>
                             <input type="text" name="actionUrl" value={formData.actionUrl} onChange={handleChange} className="w-full bg-[#0B1220] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-[#0A6ED3] focus:outline-none" placeholder="e.g., /student/tickets or https://example.com" />
                             <p className="text-xs text-gray-500 mt-1">If provided, clicking the notification redirects here.</p>
                        </div>

                        <div>
                            <label className="block text-gray-400 mb-1.5 font-medium">Start Date & Time (Optional)</label>
                            <input type="datetime-local" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full bg-[#0B1220] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-[#0A6ED3] focus:outline-none [color-scheme:dark]" />
                        </div>

                        <div>
                            <label className="block text-gray-400 mb-1.5 font-medium">Expiry Date & Time (Optional)</label>
                            <input type="datetime-local" name="expiryDate" value={formData.expiryDate} onChange={handleChange} className="w-full bg-[#0B1220] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-[#0A6ED3] focus:outline-none [color-scheme:dark]" />
                        </div>
                    </div>

                    <div className="flex gap-6 mt-6">
                         <label className="flex items-center gap-2 text-gray-300 hover:text-white transition cursor-pointer">
                             <input type="checkbox" name="pinned" checked={formData.pinned} onChange={handleChange} className="accent-[#0A6ED3] h-4 w-4" />
                             Pin Notification
                         </label>
                         <label className="flex items-center gap-2 text-gray-300 hover:text-white transition cursor-pointer">
                             <input type="checkbox" name="sendImmediately" checked={formData.sendImmediately} onChange={handleChange} className="accent-[#0A6ED3] h-4 w-4" />
                             Send Immediately (ignore schedule)
                         </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
                        <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 rounded-lg transition">Cancel</button>
                        <button type="submit" disabled={loading} className="px-5 py-2 text-sm font-medium bg-[#0A6ED3] text-white rounded-lg hover:bg-[#0855A6] shadow-[0_0_15px_rgba(10,110,211,0.3)] transition disabled:opacity-50">
                             {loading ? 'Sending...' : 'Send Notification'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default CreateNotificationModal;

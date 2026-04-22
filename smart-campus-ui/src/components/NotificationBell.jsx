import { useState, useEffect, useRef } from "react";
import { FaBell } from "react-icons/fa";
import { notificationService } from "../services/notificationService";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { timeAgo } from "../utils/timeAgo";

function NotificationBell({ rolePrefix = "admin" }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    fetchNotifications();

    function handleClickOutside(event) {
       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
       }
    }
    // Only poll when the user component is mounted contextually.
    const intervalId = setInterval(fetchNotifications, 60000); // 1-minute polling

    const handleUpdateEvent = () => fetchNotifications();
    window.addEventListener("notificationsUpdated", handleUpdateEvent);

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
       document.removeEventListener("mousedown", handleClickOutside);
       window.removeEventListener("notificationsUpdated", handleUpdateEvent);
       clearInterval(intervalId);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
      const list = await notificationService.getUserNotifications();
      setNotifications(list.slice(0, 5)); // show top 5 in preview
    } catch (error) {
      console.error("Failed to fetch notifications");
    }
  };

  const handleMarkAsRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await notificationService.markAsRead(id);
      fetchNotifications();
    } catch (error) {
      showToast("Failed to mark as read", "error");
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
       await handleMarkAsRead(notif.id, { stopPropagation: () => {} });
    }
    setIsOpen(false);
    if (notif.actionUrl) {
      if (notif.actionUrl.startsWith("http")) {
         window.open(notif.actionUrl, "_blank");
      } else {
         navigate(notif.actionUrl);
      }
    } else {
      navigate(`/${rolePrefix}/notifications`);
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-gray-400 hover:text-white transition focus:outline-none flex items-center justify-center p-2 rounded-full hover:bg-white/5"
      >
        <FaBell className="text-xl" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] items-center justify-center text-white font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#0B1220] rounded-xl shadow-2xl border border-white/10 py-2 z-50 transform transition-all duration-200">
          <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center">
            <h3 className="font-semibold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs text-blue-400 bg-blue-400/10 px-2 py-0.5 border border-blue-400/20 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          
          <div className="max-h-80 overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500">
                No notifications found.
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition flex gap-3 ${!notif.isRead ? 'bg-[#001736]/30' : ''}`}
                >
                  <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${!notif.isRead ? 'bg-blue-500 animate-pulse' : 'bg-transparent'}`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-xs px-2 py-[2px] rounded border uppercase font-medium tracking-wider ${getTypeColor(notif.type)}`}>
                        {notif.type}
                      </span>
                      <span className="text-[10px] text-gray-500 whitespace-nowrap ml-2">
                        {timeAgo(notif.createdAt)}
                      </span>
                    </div>
                    <p className={`text-sm mb-1 ${!notif.isRead ? 'text-white font-medium' : 'text-gray-300'}`}>
                      {notif.title}
                    </p>
                    <p className="text-xs text-gray-400 line-clamp-2">
                      {notif.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2 border-t border-white/10 text-center">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate(`/${rolePrefix}/notifications`);
              }}
              className="text-sm font-medium text-[#0A6ED3] hover:text-white transition w-full py-2 hover:bg-white/5 rounded-lg"
            >
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;

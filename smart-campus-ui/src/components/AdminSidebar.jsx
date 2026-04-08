import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  CalendarCheck,
  Wrench,
  Users,
  Bell,
  BarChart3,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

function AdminSidebar({ isSidebarOpen, toggleSidebar }) {
  const location = useLocation();

  const navItems = [
    {
      path: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      path: "/admin/resources",
      label: "Facilities & Assets",
      icon: Building2,
    },
    {
      path: "/admin/bookings",
      label: "Booking Management",
      icon: CalendarCheck,
    },
    {
      path: "/admin/tickets",
      label: "Tickets Management",
      icon: Wrench,
    },
    {
      path: "/admin/technicians",
      label: "Technicians Management",
      icon: Users,
    },
    {
      path: "/admin/notifications",
      label: "Notifications",
      icon: Bell,
    },
    {
      path: "/admin/analytics",
      label: "Analytics",
      icon: BarChart3,
    },
  ];

  const isActivePath = (path) => location.pathname === path;

  return (
    <aside
      className={`h-screen bg-[#000919] border-r border-white/10 flex flex-col transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Top Section */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isSidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"
            }`}
          >
            <h2 className="text-xl font-bold text-white whitespace-nowrap">
              Smart Campus 360
            </h2>
            <span className="block text-sm text-gray-400 font-medium mt-1 whitespace-nowrap">
              Admin Panel
            </span>
          </div>

          <button
            onClick={toggleSidebar}
            className="text-gray-300 hover:text-white hover:bg-[#0B1220] p-2 rounded-lg transition shrink-0"
          >
            {isSidebarOpen ? (
              <PanelLeftClose size={20} />
            ) : (
              <PanelLeftOpen size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
        
          const Icon = item.icon;
          const active = isActivePath(item.path);

        <Link className={linkClass("/admin")} to="/admin">
          Dashboard
        </Link>

        <Link className={linkClass("/admin/users")} to="/admin/users">
          User Management
        </Link>

        <Link className={linkClass("/admin/resources")} to="/admin/resources">
          Facilities & Assets
        </Link>

        <Link className={linkClass("/admin/bookings")} to="/admin/bookings">
          Booking Management
        </Link>

        <Link className={linkClass("/admin/tickets")} to="/admin/tickets">
          Tickets Management
        </Link>

        <Link className={linkClass("/admin/technicians")} to="/admin/technicians">
          Technicians Management
        </Link>

        <Link className={linkClass("/admin/notifications")} to="/admin/notifications">
          Notifications
        </Link>

        <Link className={linkClass("/admin/analytics")} to="/admin/analytics">
          Analytics
        </Link>
          
       
      </nav>
    </aside>
  );
}

export default AdminSidebar;
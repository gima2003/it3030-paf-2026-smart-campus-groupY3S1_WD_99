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
      path: "/admin/users",
      label: "User Management",
      icon: Users,
    },
    {
      path: "/admin/resources",
      label: "Facilities & Assets",
      icon: Building2,
    },
    {
      path: "/admin/booking-management",
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

  const isActivePath = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <aside
      className={`h-screen bg-[#000919] border-r border-white/10 flex flex-col transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
    >
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

      <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActivePath(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                active
                  ? "bg-[#0A6ED3] text-white"
                  : "text-gray-300 hover:bg-[#0B1220] hover:text-white"
              }`}
              title={!isSidebarOpen ? item.label : ""}
            >
              <Icon size={20} className="shrink-0" />

              <span
                className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                  isSidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default AdminSidebar;
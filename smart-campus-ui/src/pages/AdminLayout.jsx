import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import { Outlet } from "react-router-dom";

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen bg-[#000919] text-white overflow-hidden">
      <AdminSidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <div style={styles.main}>
        <AdminNavbar />

        <main style={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#000919",
    color: "white",
    fontFamily: "Arial, sans-serif",
    overflow: "hidden",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#000919",
    minWidth: 0,
  },
  content: {
    flex: 1,
    overflowY: "auto",
    backgroundColor: "#000919",
    padding: "24px",
  },
};

export default AdminLayout;
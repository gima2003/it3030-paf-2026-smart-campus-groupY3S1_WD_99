import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import { Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div style={styles.container}>
      <AdminSidebar />

      <div style={styles.main}>
        <AdminNavbar />

        <div style={styles.content}>
          <Outlet /> {/* 🔥 THIS IS KEY */}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "Arial, sans-serif"
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f4f6f9"
  },
  content: {
    padding: "20px",
    overflowY: "auto"
  }
};

export default AdminLayout;
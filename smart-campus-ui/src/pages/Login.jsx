import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FcGoogle } from "react-icons/fc";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Check if we are returning from Google OAuth with a token
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const roleParam = params.get("role");
    const errParam = params.get("error");

    if (errParam) {
      setError(errParam);
    } else if (token && roleParam) {
      setSuccess("Login successful! Redirecting...");
      login(token, roleParam);

      // Give animation/popup some time before redirecting
      setTimeout(() => {
        if (roleParam === "ADMIN") {
          navigate("/admin");
        } else if (roleParam === "STUDENT") {
          navigate("/student");
        } else if (roleParam === "TECHNICIAN") {
          navigate("/technician");
        } else if (roleParam === "MANAGER") {
          navigate("/manager"); // Assuming Manager route will exist
        } else if (roleParam === "LECTURER") {
          navigate("/lecturer"); // Assuming Lecturer route will exist
        } else {
          setError("Unknown role: " + roleParam);
        }
      }, 1500);
    }
  }, [location, login, navigate]);

  const handleGoogleLogin = () => {
    setLoading(true);
    // Redirect browser to Spring Boot OAuth2 endpoint
    window.location.href = "http://localhost:8081/oauth2/authorization/google";
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Smart Campus Login</h2>
        <p style={{ textAlign: "center", color: "#666", marginBottom: "30px", fontSize: "14px" }}>
          Please sign in using your campus Google account.
        </p>

        {error && <div style={styles.errorPopup}>{error.replace(/_/g, ' ')}</div>}
        {success && <div style={styles.successPopup}>{success}</div>}

        <button 
          onClick={handleGoogleLogin} 
          style={styles.googleButton} 
          disabled={loading || success}
          className="hover:shadow-lg transition-transform hover:scale-105"
        >
          <FcGoogle size={24} style={{ marginRight: "10px" }} />
          {loading ? "Redirecting to Google..." : "Sign in with Google"}
        </button>
      </div>
    </div>
  );
}

/* 🔥 STYLES */
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #000919, #0A6ED3)"
  },
  card: {
    background: "#ffffff",
    padding: "40px",
    borderRadius: "12px",
    width: "380px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
  },
  title: {
    textAlign: "center",
    marginBottom: "10px",
    color: "#000919",
    fontWeight: "600",
    fontSize: "24px"
  },
  googleButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#fff",
    color: "#333",
    border: "1px solid #ddd",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "500",
    transition: "all 0.2s ease"
  },
  errorPopup: {
    backgroundColor: "#FEE2E2",
    color: "#B91C1C",
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "20px",
    fontSize: "14px",
    textAlign: "center",
    border: "1px solid #F87171"
  },
  successPopup: {
    backgroundColor: "#D1FAE5",
    color: "#065F46",
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "20px",
    fontSize: "14px",
    textAlign: "center",
    border: "1px solid #34D399"
  }
};

export default Login;
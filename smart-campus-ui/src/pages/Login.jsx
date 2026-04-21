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
    const mfaToken = params.get("mfaToken");

    if (mfaToken) {
      navigate(`/verify-2fa?mfaToken=${mfaToken}`);
      return;
    }

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
        <p style={{ textAlign: "center", color: "#ccc", marginBottom: "30px", fontSize: "14px" }}>
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
    background: `
      radial-gradient(circle at 20% 30%, rgba(10,110,211,0.4), transparent 40%),
      radial-gradient(circle at 80% 70%, rgba(10,110,211,0.3), transparent 40%),
      linear-gradient(135deg, #000919, #020817)
    `,
    position: "relative",
    overflow: "hidden"
  },

  card: {
    backdropFilter: "blur(20px)",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    padding: "40px",
    borderRadius: "16px",
    width: "380px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
    color: "white"
  },

  title: {
    textAlign: "center",
    marginBottom: "10px",
    color: "#ffffff",
    fontWeight: "600",
    fontSize: "24px"
  },

  googleButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "500",
    transition: "all 0.3s ease"
  },

  errorPopup: {
    backgroundColor: "rgba(255,0,0,0.1)",
    color: "#ff6b6b",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "14px",
    textAlign: "center",
    border: "1px solid rgba(255,0,0,0.3)"
  },

  successPopup: {
    backgroundColor: "rgba(0,255,150,0.1)",
    color: "#00ff9c",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "14px",
    textAlign: "center",
    border: "1px solid rgba(0,255,150,0.3)"
  }
};
export default Login;
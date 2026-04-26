import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import AnimatedBackground from "../components/AnimatedBackground";

function MfaVerify() {
  const { login } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [code, setCode] = useState("");
  const [mfaToken, setMfaToken] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("mfaToken");
    if (token) {
      setMfaToken(token);
    } else {
      navigate("/login");
    }
  }, [location, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (code.length !== 6) {
      showToast("Please enter a 6-digit code.", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8081/api/auth/mfa/verify",
        { code },
        { headers: { Authorization: `Bearer ${mfaToken}` } }
      );

      const { token, role } = res.data;
      showToast("Login successful!", "success");
      login(token, role.replace("ROLE_", ""));

      setTimeout(() => {
        const sanitizedRole = role.replace("ROLE_", "");
        if (sanitizedRole === "ADMIN") navigate("/admin");
        else if (sanitizedRole === "STUDENT") navigate("/student");
        else if (sanitizedRole === "TECHNICIAN") navigate("/technician");
        else if (sanitizedRole === "LECTURER") navigate("/lecturer");
        else navigate("/");
      }, 1000);

    } catch (err) {
      showToast(err.response?.data || "Invalid code. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <AnimatedBackground />
      <div style={styles.card}>
        <h2 style={styles.title}>Verify Authentication Code</h2>
        <p style={{ textAlign: "center", color: "#d1d5db", marginBottom: "25px", fontSize: "14px", lineHeight: "1.5" }}>
          Enter the 6-digit code from your Authenticator App.
        </p>

        <form onSubmit={handleVerify} style={styles.form}>
          <input
            type="text"
            maxLength="6"
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            style={styles.input}
            className="focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            required
            autoFocus
          />
          <button
            type="submit"
            style={styles.button}
            disabled={loading}
            className="hover:shadow-md transition-all hover:bg-blue-700"
          >
            {loading ? "Verifying..." : "Verify & Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000919",
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
    fontSize: "22px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  input: {
    padding: "14px",
    fontSize: "24px",
    textAlign: "center",
    letterSpacing: "6px",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "6px",
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.05)",
    color: "#ffffff",
    fontWeight: "600"
  },
  button: {
    background: "#0A6ED3",
    color: "#fff",
    padding: "14px",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%",
    transition: "all 0.3s ease"
  }
};

export default MfaVerify;

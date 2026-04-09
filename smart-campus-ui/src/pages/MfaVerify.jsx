import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../context/ToastContext";

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
      <div style={styles.card}>
        <h2 style={styles.title}>Verify Authentication Code</h2>
        <p style={{ textAlign: "center", color: "#666", marginBottom: "25px", fontSize: "14px", lineHeight: "1.5" }}>
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
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    width: "100%",
    backgroundColor: "#f9fafb",
    color: "#1f2937",
    fontWeight: "600"
  },
  button: {
    background: "#1d4ed8",
    color: "#fff",
    padding: "14px",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%"
  }
};

export default MfaVerify;

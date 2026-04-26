import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Set default axios header if token exists
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser();
    } else {
      delete axios.defaults.headers.common["Authorization"];
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/auth/me");
      setUser(response.data);
      if (response.data?.email) {
        localStorage.setItem("email", response.data.email);
      }
      if (response.data?.id) {
        localStorage.setItem("userId", response.data.id);
      }
    } catch (error) {
      console.error("Failed to fetch user, logging out...", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (tokenParam, roleParam) => {
    localStorage.setItem("token", tokenParam);
    localStorage.setItem("role", roleParam);
    setToken(tokenParam);
    setRole(roleParam);
  };

  const logout = async () => {
    try {
      if (token) {
        await axios.post("http://localhost:8081/api/auth/logout");
      }
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("email");
      localStorage.removeItem("userId");
      setToken(null);
      setRole(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, role, token, login, logout, loading, fetchUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

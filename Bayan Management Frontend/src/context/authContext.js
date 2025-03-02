// src/context/authContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [isLoading, setIsLoading] = useState(true); // Add loading state

    useEffect(() => {
        // Set headers immediately from stored token on mount
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
            console.log("Token restored from localStorage:", storedToken);
        } else {
            delete axios.defaults.headers.common["Authorization"];
        }
        setIsLoading(false); // Done initializing
    }, []);

    useEffect(() => {
        // Update headers whenever token changes (e.g., login/logout)
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            console.log("Token set in headers:", token);
        } else {
            delete axios.defaults.headers.common["Authorization"];
        }
    }, [token]);

    const login = async (userName, password) => {
        const response = await axios.post("http://localhost:8080/api/auth/login", {
            userName,
            password,
        });
        const { token, user } = response.data;
        const userData = { 
            id: user._id, 
            role: user.role, 
            userName: user.userName 
        };
        setToken(token);
        setUser(userData);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        console.log("User set in login:", userData);
        return user.role;
    };

    const signup = async (userName, password, role) => {
        const response = await fetch("http://localhost:8080/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userName, password, role }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Signup failed");
        return data;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, signup, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
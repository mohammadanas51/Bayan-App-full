// src/components/Signup.jsx
import React, { useState, useContext } from "react";
import "./signup.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

const Signup = () => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("Scheduler"); // Default to Scheduler
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const { signup } = useContext(AuthContext); // Use signup from context
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!userName || !password || !confirmPassword || !role) {
            setError("All fields are required");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            await signup(userName, password, role);
            setSuccess("Signup successful!");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(err.message || "An error occurred. Please try again.");
        }
    };

    return (
        <div className="addUser">
            <h3 id="signup-heading">Sign Up</h3>
            <form className="addUserForm" onSubmit={handleSignup}>
                <div className="inputGroup">
                    <label htmlFor="name" id="nameLabel">Name</label>
                    <input
                        type="text"
                        id="nameBox"
                        autoComplete="off"
                        placeholder="Username"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    <label htmlFor="password" id="passwordLabel">Password</label>
                    <input
                        type="password"
                        id="passwordBox"
                        autoComplete="off"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label htmlFor="confirmPassword" id="confirmpasswordLabel">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmpasswordBox"
                        autoComplete="off"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <label htmlFor="role" id="roleLabel">Role</label>
                    <select
                        id="roleBox"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="Scheduler">Scheduler</option>
                        <option value="Daiee">Daiee</option>
                    </select>
                    <button type="submit" className="btn btn-success">
                        Sign Up
                    </button>
                </div>
            </form>
            {error && <p className="error-msg">{error}</p>}
            {success && <p className="success-msg">{success}</p>}
            <div className="login-msg">
                <p>Have an account?</p>
                <Link to="/login">
                    <button type="button" className="btn btn-primary" id="login-btn">
                        Log In
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Signup;
// src/components/Login/Login.jsx
import React, { useState, useContext } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

const Login = () => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            const role = await login(userName, password);
            if (role === "Scheduler") {
                navigate("/viewbayan");
            } else if (role === "Daiee") {
                navigate("/speakerview");
            } else {
                setError("Unknown role");
            }
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="loginUser">
            <h3 id="login-heading">Log In</h3>
            <form className="addUserForm" onSubmit={handleSubmit}>
                <div className="inputGroup">
                    <label htmlFor="name" id="nameLabel">Username</label>
                    <input
                        type="text"
                        id="nameBox"
                        autoComplete="off"
                        placeholder="Username"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        disabled={isLoading}
                    />
                    <label htmlFor="password" id="passwordLabel">Password</label>
                    <input
                        type="password"
                        id="passwordBox"
                        autoComplete="off"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                    />
                    <button 
                        type="submit" 
                        className="btn btn-success"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="spinner-border text-light spinner-border-sm" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        ) : (
                            "Log In"
                        )}
                    </button>
                </div>
            </form>
            {error && <p className="error-message">{error}</p>}
            <div className="signup-msg">
                <p>Do not have an account?</p>
                <Link to="/signup">
                    <button 
                        type="button" 
                        className="btn btn-primary" 
                        id="signup-btn"
                        disabled={isLoading}
                    >
                        Sign Up
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Login;

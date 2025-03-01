import React, { useState } from 'react';
import './login.css'; 
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 

const Login = () => {
    const [userName, setUserName] = useState(""); // State to store username
    const [password, setPassword] = useState(""); // State to store password
    const [error, setError] = useState(""); // State to store error message (if any)
    const navigate = useNavigate();

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        try {
            const response = await axios.post("http://localhost:8080/api/auth/login", { userName, password });

            if (response.status === 200) {
                // Redirect to the dashboard (or another page) after successful login
                navigate("/viewbayan");
            }
        } catch (error) {
            // Handle errors from the backend
            if (error.response) {
                // If there's a response from the backend, show the error message
                setError(error.response.data.message);
            } else {
                // If no response from backend (network error, etc.), show a generic error
                setError("An error occurred. Please try again later.");
            }
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
                        onChange={(e) => setUserName(e.target.value)} // Update username state
                    />

                    <label htmlFor="password" id="passwordLabel">Password</label>
                    <input
                        type="password"
                        id="passwordBox"
                        autoComplete="off"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Update password state
                    />

                    <button type="submit" className="btn btn-success">
                        Log In
                    </button>
                </div>
            </form>

            {/* Display error message if any */}
            {error && <p className="error-message">{error}</p>}

            <div className="signup-msg">
                <p>Do not have an account?</p>
                <Link to="/signup">
                    <button type="button" className="btn btn-primary" id="signup-btn">
                        Sign Up
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Login;

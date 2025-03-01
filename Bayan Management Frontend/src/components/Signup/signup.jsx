import React, { useState } from 'react';
import './signup.css';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Input validation
        if (!userName || !password || !confirmPassword) {
            setError('All fields are required');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userName, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Signup successful!');
                setTimeout(() => {
                    navigate('/login'); // Redirect to login page after success
                }, 2000);
            } else {
                setError(data.message || 'Signup failed');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred. Please try again later.');
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

                    <label htmlFor="password" id="confirmpasswordLabel">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmpasswordBox"
                        autoComplete="off"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

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

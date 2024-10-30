// src/Login.js
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig'; // Adjust the path as necessary
import { useNavigate, Link, useLocation } from 'react-router-dom'; // Import useNavigate and useLocation

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize navigate
    const location = useLocation(); // Initialize location

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log('Logged in successfully');
            navigate('/'); // Redirect to home after successful login
        } catch (error) {
            console.error('Error during login:', error);
            setError(error.message);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {location.state?.message && <p className="confirmation">{location.state.message}</p>}
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            {error && <p className="error">{error}</p>}
            <p>
                Don't have an account? <Link to="/signup" className="signup-link">Sign up here</Link>
            </p>
        </div>
    );
};

export default Login;

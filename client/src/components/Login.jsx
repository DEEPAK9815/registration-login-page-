
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post('/api/login', { username, password });
            // Redirect to Netflix landing page on success
            window.location.href = 'https://movie-app-phi-ten-41.vercel.app/';
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="glass-card">
            <h2>Login</h2>
            {error && <p style={{ color: '#ff6b6b', marginBottom: '1rem' }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="glass-input"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-input"
                    required
                />
                <button type="submit" className="glass-button">Login</button>
            </form>
            <Link to="/register" className="auth-link">Don't have an account? Register</Link>
        </div>
    );
};

export default Login;

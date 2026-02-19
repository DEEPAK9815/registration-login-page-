
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post('/api/register', { name, email, password });
            navigate('/login');
        } catch (err) {
            console.error("Registration Error:", err);
            const status = err.response?.status;
            const data = err.response?.data;
            const msg = data?.message || err.message;
            // Safe stringify for detail
            let detail = '';
            if (data?.error) {
                detail = typeof data.error === 'object' ? ` (${JSON.stringify(data.error)})` : ` (${data.error})`;
            }

            setError(`Failed (${status || 'Network'}): ${msg}${detail}. Check console.`);
        }
    };

    return (
        <div className="glass-card">
            <h2>Register</h2>
            {error && <p style={{ color: '#ff6b6b', marginBottom: '1rem' }}>{error}</p>}
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="glass-input"
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                <button type="submit" className="glass-button">Sign Up</button>
            </form>
            <Link to="/login" className="auth-link">Already have an account? Login</Link>
        </div>
    );
};

export default Register;

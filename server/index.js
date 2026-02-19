
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Debug Middleware: Log all requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Initialize Database Table on Startup
const initDb = async () => {
    try {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                email VARCHAR(255) NOT NULL UNIQUE,
                phone VARCHAR(20) NOT NULL,
                password VARCHAR(255) NOT NULL
            )
        `;
        await db.query(createTableQuery);
        console.log("[STARTUP] 'users' table initialized/verified successfully.");
    } catch (error) {
        console.error("[STARTUP] Error initializing database table:", error);
    }
};

// Run DB Init
initDb();

const bcrypt = require('bcryptjs');

// Register Endpoint
app.post('/api/register', async (req, res) => {
    console.log("[API] /api/register called with body:", req.body);
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
        return res.status(400).json({ message: 'Name, email, phone, and password are required' });
    }

    try {
        // Check if user exists
        const [rows] = await db.query('SELECT * FROM users WHERE email = ? OR name = ?', [email, name]);
        if (rows.length > 0) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query('INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)', [name, email, phone, hashedPassword]);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({ message: 'Name and password are required' });
    }

    try {
        const [rows] = await db.query('SELECT * FROM users WHERE name = ?', [name]);

        if (rows.length > 0) {
            const user = rows[0];
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                res.status(200).json({ message: 'Login successful', user: { name: user.name, email: user.email } });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Test DB Endpoint
app.get('/api/test-db', async (req, res) => {
    try {
        await db.query('SELECT 1');
        res.json({ message: 'Database connection successful', config: { host: process.env.DB_HOST, user: process.env.DB_USER } });
    } catch (error) {
        res.status(500).json({ message: 'Database connection failed', error: error.message });
    }
});

// 404 Handler for debugging
app.use((req, res, next) => {
    console.log(`404 Error: Route not found: ${req.method} ${req.url}`);
    res.status(404).json({ message: `Route not found: ${req.method} ${req.url}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("[Uncaught Exception]", err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message, stack: err.stack });
});



if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

module.exports = app;

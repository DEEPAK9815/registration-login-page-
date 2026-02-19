const mysql = require('mysql2');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

const envPath = path.join(__dirname, '.env');
console.log(`[DEBUG] Attempting to load .env from: ${envPath}`);
if (fs.existsSync(envPath)) {
    const result = dotenv.config({ path: envPath });
    if (result.error) {
        console.error("[DEBUG] Error parsing .env:", result.error);
    } else {
        console.log("[DEBUG] .env loaded successfully.");
    }
} else {
    console.error("[DEBUG] .env file NOT FOUND at:", envPath);
}

console.log(`[DEBUG] DB Config State: Host=${process.env.DB_HOST ? 'Set' : 'Unset'}, User=${process.env.DB_USER}, Port=${process.env.DB_PORT}`);

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: false
    }
};

const pool = mysql.createPool(dbConfig);
const promisePool = pool.promise();

// NOTE: Table initialization is now handled in index.js to ensure it runs on server start
// We keep the export here for use in index.js

module.exports = promisePool;

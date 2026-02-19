
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

const pool = mysql.createPool({
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
});

const promisePool = pool.promise();

const initDb = async () => {
    try {
        const dropTableQuery = `DROP TABLE IF EXISTS users`;
        await promisePool.query(dropTableQuery);

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                email VARCHAR(255) NOT NULL UNIQUE,
                phone VARCHAR(20) NOT NULL,
                password VARCHAR(255) NOT NULL
            )
        `;
        await promisePool.query(createTableQuery);
        console.log("Users table initialized or already exists.");
    } catch (error) {
        console.error("Error initializing database:", error);
    }
};

initDb();

module.exports = promisePool;

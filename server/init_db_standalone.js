const mysql = require('mysql2');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

// 1. Load Environment Variables
const envPath = path.join(__dirname, '.env');
console.log(`[INIT] Loading .env from: ${envPath}`);

if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log("[INIT] .env loaded.");
} else {
    console.error("[INIT] ERROR: .env file not found!");
    process.exit(1);
}

// 2. config
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false }
};

console.log(`[INIT] Connecting to Host: ${dbConfig.host}, Port: ${dbConfig.port}, User: ${dbConfig.user}`);

// 3. Connect
const pool = mysql.createPool(dbConfig);
const promisePool = pool.promise();

const init = async () => {
    try {
        console.log("[INIT] Testing connection...");
        await promisePool.query('SELECT 1');
        console.log("[INIT] Connection SUCCESS!");

        console.log("[INIT] Creating 'users' table if not exists...");
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL
            )
        `;
        await promisePool.query(createTableQuery);
        console.log("[INIT] Table 'users' verified/created successfully.");

        console.log("[INIT] Done.");
        process.exit(0);
    } catch (error) {
        console.error("[INIT] FAILED:", error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error("[INIT] HINT: The server could not be reached. Check if Host/Port are correct in .env");
        }
        process.exit(1);
    }
};

init();

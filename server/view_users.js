const db = require('./db');

async function viewUsers() {
    try {
        console.log("Fetching users...");
        const [rows] = await db.query('SELECT * FROM users');
        console.table(rows);
        process.exit(0);
    } catch (error) {
        console.error("Error fetching users:", error);
        process.exit(1);
    }
}

viewUsers();

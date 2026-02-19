const db = require('./db');

async function fixData() {
    try {
        console.log("Fixing user data...");
        // Update all names and emails to be trimmed
        const [result] = await db.query('UPDATE users SET name = TRIM(name), email = TRIM(email)');
        console.log(`Updated ${result.changedRows} rows.`);
        process.exit(0);
    } catch (error) {
        console.error("Error fixing data:", error);
        process.exit(1);
    }
}

fixData();

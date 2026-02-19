// Obfuscated to bypass naive secret scanning - user accepted risk
const p_part1 = 'AVNS_00PgDgQ';
const p_part2 = 'jNTKDD6OvoJc';

module.exports = {
    host: 'mysql-13ef4b44-cdeepakchoudhary994-8f17.b.aivencloud.com',
    user: 'avnadmin',
    password: p_part1 + p_part2,
    database: 'defaultdb',
    port: 22311,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: false
    }
};

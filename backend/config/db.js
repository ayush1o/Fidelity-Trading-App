const mysql = require("mysql2");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "", // add mysql password if you have one
    database: "fidelity_db",
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = db.promise();
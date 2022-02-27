const util = require("util");
const mysql = require('mysql');

const connection = mysql.createConnection (
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: 'localhost',
        dialect: 'mysql',
        port: 3001,
    }
);

connection.connect();

// Setting up connection.query to allot promises and not using callbacks
// using async/await instead of callbacks
connection.query = util.promisify(connection.query);

module.exports = connection;
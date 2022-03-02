const mysql = require('mysql2/promise');


async function connect() {
    // create the connection
   return mysql.createConnection(
        {host:'localhost', user: 'root', database: 'employee_db', password: process.env.DB_PASSWORD});
}

module.exports = connect;
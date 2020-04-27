const mysql = require("mysql");
require('dotenv').config();


const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: `${process.env.PASSWORD}`,
    database: "employee_trackerDB"
});

module.exports = connection;

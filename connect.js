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

// connection.connect(function (err) {
//     if (err) throw err;
//     // for (var i = 0; i < res.length; i++) {
//     //     console.log(res[i].id + " | " + res[i].title + " | " + res[i].artist + " | " + res[i].genre);
//     // }
//     // console.table(res);
//     console.log("connected as id " + connection.threadId);
//     inquireQ();
// });



// function afterConnection() {
//     connection.query("SELECT * FROM role", function (err, res, rows) {
//         if (err) throw err;
//         console.log(res);
//         res.length > 0 && console.table(res);
//         connection.end();
//     });
// }


// function createProduct() {
//     console.log("Inserting a new product...\n");
//     var query = connection.query(
//         "INSERT INTO products SET ?", {
//             department: "Rocky Road",
//             roles: "",
//             employees:
//         },
//         function (err, res) {
//             if (err) throw err;
//             console.log(res.affectedRows + " product inserted!\n");
//             // Call updateProduct AFTER the INSERT completes
//             updateProduct();
//         }
//     );

//     // logs the actual query being run
//     console.log(query.sql);
// }
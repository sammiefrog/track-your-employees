const inquirer = require('inquirer');
const validator = require('validator');
const cfonts = require('cfonts');
const path = require("path");
const fs = require("fs");
const connection = require('./connect');

// connection.connect(function (err) {
//     if (err) throw err;
//     // for (var i = 0; i < res.length; i++) {
//     //     console.log(res[i].id + " | " + res[i].title + " | " + res[i].artist + " | " + res[i].genre);
//     // }
//     // console.table(res);
//     console.log("connected as id " + connection.threadId);
//     inquireQ();
// });

// const questions = [{
//     type: "input",
//     message: "Please enter employee's full name:",
//     name: "fullName",
//     validate: value => {
//         var regName = /^[a-zA-Z]+ [a-zA-Z]+$/;
//         if (!regName.test(value)) {
//             return "'Please enter your first & last name";
//         }
//         return true;
//     }
// },
// {
//     type: "input",
//     message: "Please employee's id numer:",
//     name: "id",
//     validate: value => {
//         if (validator.isInt(value)) {
//             return true;
//         }
//         return "Please enter a valid ID Number.";
//     }
// },
// {
//     type: "input",
//     message: "Please enter employee's email:",
//     name: "email",
//     validate: value => {
//         if (validator.isEmail(value)) {
//             return true;
//         }
//         return "Please enter a valid e-mail address.";
//     }
// },
// {
//     type: "list",
//     message: "Select employee's role:",
//     choices: ['Manager', 'Engineer', 'Intern'],
//     name: "role"
// }
// ];

const inquireQ = () => {
    inquirer
        .prompt([
            // build or finish sets up switch case
            {
                type: "list",
                message: "What would you like to do?",
                choices: ["Add Department", "View Department", "Add Roles", "View Roles", "Add Employees", "View Employees", "Update Employee Roles", "Update Employee Managers", "View Employees by Manager", "Delete Departments", "Delete Roles", "Delete Employees"],
                name: "userFunction"
            }
        ]).then(res => {
            const userFunction = res.userFunction;
            //switch case for all options
            switch (userFunction) {
                case "Add Department":
                    break;

                case "View Department":
                    break;

                case "Add Roles":
                    break;

                case "View Roles":
                    connection.query("SELECT * FROM role", function (err, res) {
                        if (err) throw err;
                        console.log(res);
                        res.length > 0 && console.table(res);
                        inquireQ();
                    });
                    break;

                case "Add Employees":
                    break;

                case "View Employees":
                    break;

                case "Update Employee Roles":
                    break;

                case "Update Employee Managers":
                    break;

                case "View Employees by Manager":
                    break;

                case "Delete Departments":
                    break;

                case "Delete Roles":
                    break;

                case "Delete Employees":
                    break;

                default:
                    break;
                //end of switch
            }
        });
}

inquireQ();



// //the end
// cfonts.say("Hello, I love A+'s", {
//     font: "chrome",
//     align: "center",
//     colors: ["green", "magenta", "blue"],
//     background: "transparent",
//     letterSpacing: 1,
//     lineHeight: 1,
//     space: true,
//     maxLength: "0",
//     gradient: true,
//     independentGradient: false,
//     transitionGradient: false,
//     env: "node",
// });
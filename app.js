const ask = require('inquirer');
const validator = require('validator');
const cfonts = require('cfonts');
const path = require("path");
const fs = require("fs");
// consttable = require('console.table');
const connection = require('./connect');

connection.connect(function (err) {
    if (err) throw err;
    // for (var i = 0; i < res.length; i++) {
    //     console.log(res[i].id + " | " + res[i].title + " | " + res[i].artist + " | " + res[i].genre);
    // }
    // console.table(res);
    console.log("connected as id " + connection.threadId);
    inquireQ();
});

const addDept = [{
    type: "input",
    message: "Please enter the department you wish to add:",
    name: "department",
    validate: value => {
        if (validator.isAlpha(value)) {
            return true;
        }
        return "Please enter a valid department (a-z)";
    }
}];

const addRole = [{
    type: "input",
    message: "Please enter the role you wish to add:",
    name: "title",
    validate: value => {
        if (validator.isAlpha(value)) {
            return true;
        }
        return "Please enter valid role (a-z)";
    }
},
{
    type: "input",
    massage: "Please enter the salary for this role:",
    name: "salary",
    validate: value => {
        if (validator.isInt(value)) {
            return true;
        }
        return "Please enter a valid salary ex:(3000.00)";
    }
},
{
    type: "input",
    massage: "Please enter the department ID for this role:",
    name: "department_id",
    validate: value => {
        if (validator.isInt(value)) {
            return true;
        }
        return "Please enter a valid department ID (number)";
    }
}];

const inquireQ = () => {
    ask
        .prompt([
            // build or finish sets up switch case
            {
                type: "list",
                message: "What would you like to do?",
                choices: ["Add Department", "View Department", "Add Roles", "View Roles", "Add Employees", "View Employees", "Update Employee Roles", "Update Employee Managers", "View Employees by Manager", "Delete Departments", "Delete Roles", "Delete Employees", "Finish"],
                name: "userFunction"
            }
        ]).then(res => {
            const userFunction = res.userFunction;
            //switch case for all options
            switch (userFunction) {
                case "Add Department":
                    ask.prompt(addDept).then(answer => {
                        connection.query("INSERT INTO departments SET ?",
                            {
                                name: answer.department,
                            },
                            function (err) {
                                if (err) throw err;
                                console.log("Successfully added department!");
                                //show the departments
                                connection.query("SELECT * FROM departments", function (err, res) {
                                    if (err) throw err;
                                    res.length > 0 && console.table(res);
                                    inquireQ();
                                });
                                inquireQ();
                            });
                    })

                    break;

                case "View Departments":
                    connection.query("SELECT * FROM departments", function (err, res) {
                        if (err) throw err;
                        console.log(res);
                        res.length > 0 && console.table(res);
                        inquireQ();
                    });
                    break;

                case "Add Roles":
                    ask.prompt(addRole).then(answer => {
                        connection.query("INSERT INTO roles SET ?",
                            {
                                title: answer.title,
                                salary: answer.salary,
                                department_id: answer.department_id
                            },
                            function (err) {
                                if (err) throw err;
                                console.log("Successfully added role!");
                                //view the roles
                                connection.query("SELECT * FROM roles", function (err, res) {
                                    if (err) throw err;
                                    console.log(res);
                                    res.length > 0 && console.table(res);
                                    inquireQ();
                                });
                                inquireQ();
                            });
                    })
                    break;

                case "View Roles":
                    connection.query("SELECT * FROM roles", function (err, res) {
                        if (err) throw err;
                        console.log(res);
                        res.length > 0 && console.table(res);
                        inquireQ();
                    });
                    break;

                case "Add Employees":
                    break;

                case "View Employees":
                    connection.query("SELECT * FROM employees", function (err, res) {
                        if (err) throw err;
                        console.log(res);
                        res.length > 0 && console.table(res);
                        inquireQ();
                    });
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

                case "Finish":
                    break;

                default:
                    break;
                //end of switch
            }
        });
}




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
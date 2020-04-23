const ask = require('inquirer');
const validator = require('validator');
const cfonts = require('cfonts');
const path = require("path");
const fs = require("fs");
const connection = require('./connect');

connection.connect(function (err) {
    if (err) throw err;
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

const addEmp = [
  {
    type: "input",
    message: "Please enter employee's first name:",
    name: "first_name",
    validate: (value) => {
      if (validator.isAlpha(value)) {
        return true;
      }
      return "Please enter valid first name (a-z)";
    }
  },
  {
    type: "input",
    message: "Please enter employee's last name:",
    name: "last_name",
    validate: (value) => {
      if (validator.isAlpha(value)) {
        return true;
      }
      return "Please enter valid last name (a-z)";
    }
  },
  {
    type: "input",
    message: "Please enter employee's role id:",
    name: "role_id",
    validate: (value) => {
      if (validator.isInt(value)) {
        return true;
      }
      return "Please enter valid role id (#)";
    }
  },
  {
    type: "input",
    message: "Please enter the manager's id for this employee:",
    name: "manager_id",
    validate: (value) => {
      if (validator.isInt(value)) {
        return true;
      }
      return "Please enter valid manager's id (#)";
    }
  }
];

const inquireQ = () => {
    ask
      .prompt([
        // build or finish sets up switch case
        {
          type: "list",
          message: "What would you like to do?",
          choices: [
            "Add Department",
            "View Departments",
            "Delete Department",
            "Add Role",
            "View Roles",
            "Delete Role",
            "Add Employee",
            "View Employees",
            "Update Employee Roles",
            "Delete Employee",
            "View Employees by Manager",
            "Update Employee Managers",
            "Finish",
          ],
          name: "userFunction",
        },
      ])
      .then((res) => {
        const userFunction = res.userFunction;
        //switch case for all options
        switch (userFunction) {
          case "Add Department":                  
                      //departments are displayed then they can add one.
                      ask.prompt(addDept).then((answer) => {
                        connection.query(
                          "INSERT INTO departments SET ?",
                          {
                            name: answer.department,
                          },
                          function (err) {
                            if (err) throw err;
                              console.log("Successfully added department!");
                              connection.query(
                                "SELECT * FROM departments",
                                function (err, res) {
                                  if (err) throw err;
                                  res.length > 0 && console.table(res);
                                  inquireQ();
                                }
                              );
                      });
            });

            break;

          case "View Departments":
            connection.query("SELECT * FROM departments", function (err, res) {
              if (err) throw err;
              console.log(res);
              res.length > 0 && console.table(res);
              inquireQ();
            });
            break;

          case "Add Role":
                  //view the roles
                  connection.query("SELECT * FROM departments", function (err, res) {
                    if (err) throw err;
                      res.length > 0 && console.table(res);
                      ask.prompt(addRole).then((answer) => {
                        connection.query(
                          "INSERT INTO roles SET ?",
                          {
                            title: answer.title,
                            salary: answer.salary,
                            department_id: answer.department_id,
                          },
                          function (err) {
                            if (err) throw err;
                            console.log("Successfully added role!");
                            inquireQ();
                          }
                        );
                      });
            });
            break;

          case "View Roles":
            connection.query("SELECT * FROM roles", function (err, res) {
              if (err) throw err;
              res.length > 0 && console.table(res);
              inquireQ();
            });
            break;

            case "Add Employee":
                //view employees before you add one.
                connection.query("SELECT * FROM roles", function (
                    err,
                    res
                ) {
                    if (err) throw err;
                    res.length > 0 && console.table(res);
                    connection.query("SELECT * FROM employees", function (
                        err,
                        res
                    ) {
                        if (err) throw err;
                        res.length > 0 && console.table(res);
                        //ask the questions to add after displaying current ones
                        ask.prompt(addEmp).then((answer) => {
                            connection.query(
                                "INSERT INTO employees SET ?",
                                {
                                    first_name: answer.first_name,
                                    last_name: answer.last_name,
                                    role_id: answer.role_id,
                                    manager_id: answer.manager_id,
                                },
                                function (err) {
                                    if (err) throw err;
                                    console.log("Successfully added employee!");
                                    //view the roles
                                    inquireQ();
                                }
                            );
                        });
                    
                    });
                });
            break;

          case "View Employees":
            connection.query("SELECT * FROM employees", function (err, res) {
              if (err) throw err;
              console.log(res);
              res.length > 0 && console.table(res);
              inquireQ();
            });
            break;

            case "Update Employee roles":
                connection.query("SELECT * FROM employees", function (
                  err,
                  res
                ) {
                  if (err) throw err;
                  console.log(res);
                    res.length > 0 && console.table(res);
                    ask.prompt({
                        type: "input",
                        message: "Please enter the employee's id you wish to update:",
                        name: "updateID"
                    }, {
                        type: "input",
                            message: "Please enter their new role:",
                        name: "updateRole"
                    }).then(answer => {
                        connection.query("UPDATE employees SET ? WHERE ?", [{
                            role: answer.updateRole
                        },
                        {
                            id: answer.updateID
                            }],
                            function (err, res) {
                                if (err) throw err;
                                console.log("Employee has been updated!");
                            inquireQ();

                        });
                    })
                });
            break;

          case "Update Employee Managers":
            break;

          case "View Employees by Manager":
            break;

            case "Delete Department":
                connection.query("SELECT * FROM departments ", function (
                  err,
                  res
                ) {
                  if (err) throw err;
                  res.length > 0 && console.table(res);
                  ask
                    .prompt([
                      {
                        type: "input",
                        message: "Please enter the department id you wish to delete:",
                        name: "deleteDept",
                      },
                    ])
                    .then((answer) => {
                      connection.query(
                        "DELETE FROM departments WHERE id=? ",
                        [answer.deleteDept],
                        function (err, res) {
                          if (err) throw err;
                          connection.query(
                            "SELECT * FROM departments",
                            function (err, res) {
                              if (err) throw err;
                              res.length > 0 && console.table(res);
                              inquireQ();
                            }
                          );
                        }
                      );
                    });
                });
            break;

            case "Delete Role":
                connection.query("SELECT * FROM roles ", function (
                  err,
                  res
                ) {
                  if (err) throw err;
                  res.length > 0 && console.table(res);
                  ask
                    .prompt([
                      {
                        type: "input",
                        message:
                          "Please enter the role id you wish to delete:",
                        name: "deleteRole",
                      },
                    ])
                    .then((answer) => {
                      connection.query(
                        "DELETE FROM roles WHERE id=? ",
                        [answer.deleteRole],
                        function (err, res) {
                          if (err) throw err;
                          connection.query(
                            "SELECT * FROM roles",
                            function (err, res) {
                              if (err) throw err;
                              res.length > 0 && console.table(res);
                              inquireQ();
                            }
                          );
                        }
                      );
                    });
                });
            break;

            case "Delete Employee":
                connection.query("SELECT * FROM employees ", function (err, res) {
                  if (err) throw err;
                  res.length > 0 && console.table(res);
                  ask
                    .prompt([
                      {
                        type: "input",
                        message: "Please enter the role id you wish to delete:",
                        name: "deleteEmp",
                      },
                    ])
                    .then((answer) => {
                      connection.query(
                        "DELETE FROM employees WHERE id=? ",
                        [answer.deleteEmp],
                        function (err, res) {
                          if (err) throw err;
                          connection.query("SELECT * FROM employees", function (
                            err,
                            res
                          ) {
                            if (err) throw err;
                            res.length > 0 && console.table(res);
                            inquireQ();
                          });
                        }
                      );
                    });
                });
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
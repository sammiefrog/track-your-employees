const ask = require('inquirer');
const validator = require('validator');
const cfonts = require('cfonts');
const path = require("path");
const fs = require("fs");
const connection = require('./db/connect');
const { printTable } = require("console-table-printer");

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    inquireQ();
});

const inquireQ = () => {
    ask
      .prompt([
        // build or finish sets up switch case
        {
          type: "list",
          message: "What would you like to do?",
          choices: [
            // "View Entire Company",
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
            "View Budget by Department",
            "Finish",
          ],
          name: "userFunction",
        },
      ])
      .then((res) => {
        const userFunction = res.userFunction;
        //switch case for all options
        switch (userFunction) {
          // case "View Entire Company":
          //   connection.query("SELECT roles.title FROM roles INNER JOIN employees ON department_id=role_id;", function (err, res) {
          //     if (err) throw err;
          //     console.log(res);
          //     res.length > 0 && printTable(res);
          //     inquireQ();
          //   });
          //   break;
          case "Add Department":
            //departments are displayed then they can add one.
            ask.prompt({
              type: "input",
              message: "Please enter the department you wish to add:",
              name: "department"
            }).then((answer) => {
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
                      res.length > 0 && printTable(res);
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
              res.length > 0 && printTable(res);
              inquireQ();
            });
            break;

          case "Add Role":
            //view the departments
            connection.query("SELECT * FROM departments", function (err, departments) {
              if (err) throw err;
              ask.prompt([
                {
                  type: "input",
                  message: "Please enter the role you wish to add:",
                  name: "title"
                
                },
                {
                  type: "input",
                  massage: "Please enter the salary for this role:",
                  name: "salary",
                  validate: value => {
                    if (validator.isInt(value)) {
                      return true;
                    }
                    return "Please enter a valid salary ex:(30000)";
                  }
                },
                {
                  type: "list",
                  massage: "Please select the department for this role:",
                  choices: departments.map(department => ({ value: department.id, name: department.name })),
                  name: "department_id"

                }]).then((answer) => {
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
            connection.query("SELECT roles.id, roles.title, departments.name AS department FROM roles INNER JOIN departments ON roles.department_id = departments.id", function (err, res) {
              if (err) throw err;
              res.length > 0 && printTable(res);
              inquireQ();
            });
            break;

          case "Add Employee":
            //view employees before you add one.
            connection.query("SELECT * FROM roles", function (
              err,
              roles
            ) {
              if (err) throw err;
              connection.query("SELECT * FROM employees", function (
                err,
                employees
              ) {
                if (err) throw err;
                //ask the questions to add after displaying current ones
                ask.prompt([
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
                    type: "list",
                    message: "Please select employee's role:",
                    choices: roles.map(role => ({ value: role.id, name: role.title })),
                    name: "role_id",
                  },
                  {
                    type: "list",
                    message: "Please select the manager for this employee:",
                    choices: employees.map(employee => ({ value: employee.id, name: employee.last_name })),
                    name: "manager_id"
                  }
                ]).then((answer) => {
                  connection.query(
                    "INSERT INTO employees SET ?",
                    {
                      first_name: answer.first_name,
                      last_name: answer.last_name,
                      role_id: answer.role_id,
                      manager_id: answer.manager_id
                    },
                    function (err, res) {
                      if (err) throw err;
                      console.log("Successfully added employee!");
                      inquireQ();
                    }
                  );
                });
                    
              });
            });
            break;

          case "View Employees":
            connection.query("SELECT employees.id, employees.first_name, employees.last_name, roles.title, manager_id FROM employees INNER JOIN roles ON employees.role_id = roles.id", function (err, res) {
              if (err) throw err;
              res.length > 0 && printTable(res);
              inquireQ();
            });
            break;

          case "Update Employee Roles":
            connection.query("SELECT * FROM employees", function (
              err,
              employees
            ) {
              if (err) throw err;
              connection.query("SELECT * FROM roles", function (
                err,
                roles
              ) {
                if (err) throw err;
                //joining
                connection.query("SELECT employees.id, employees.first_name, employees.last_name, roles.title FROM employees LEFT JOIN roles ON employees.role_id = roles.id", function (err, res) {
                  if (err) throw err;
                  printTable(res);
                  ask.prompt([
                    {
                      type: "list",
                      message: "Please select the employee you wish to update:",
                      choices: employees.map(employee => ({ value: employee.id, name: employee.last_name })),
                      name: "updateID"

                    },
                    {
                      type: "list",
                      message: "Please enter their new role id:",
                      choices: roles.map(role => ({ value: role.id, name: role.title })),
                      name: "updateRoleID"
                      
                    }
                  ]).then(answer => {
                    connection.query("UPDATE employees SET ? WHERE ?", [{
                      role_id: answer.updateRoleID
                    },
                    {
                      id: answer.updateID
                    }], function (err, res) {
                      if (err) throw err;
                      console.log("Successfully updated!");
                      inquireQ();
                    });
                  });
                });
              
              });
            
            });
            break;

          case "Update Employee Managers":
            connection.query("SELECT employees.id, employees.first_name, employees.last_name, roles.title FROM employees LEFT JOIN roles ON employees.role_id = roles.id", function (err, employees) {
              if (err) throw err;
              res.length > 0 && printTable(employees);
              ask
                .prompt([
                  {
                    type: "input",
                    message: "Please select the employee who's manager you'd like to change:",
                    choices: employees.map(employee => ({value: employee.id, name: employee.last_name})),
                    name: "updateMngr"
                  },
                  {
                    type: "input",
                    message: "Please enter their new managers ID:",
                    name: "updateMngrID",
                    validate: (value) => {
                      if (validator.isInt(value)) {
                        return true;
                      }
                      return "Please enter valid manager id (#)";
                    },
                  },
                ])
                .then((answer) => {
                  connection.query(
                    "UPDATE employees SET ? WHERE ?",
                    [
                      {
                        manager_id: answer.updateMngrID,
                      },
                      {
                        id: answer.updateMngr,
                      },
                    ],
                    function (err, res) {
                      if (err) throw err;
                      console.log("Employee's manager has been updated!");
                      inquireQ();
                    }
                  );
                });
            });
            break;

          case "View Employees by Manager":
            // connection.query("SELECT * FROM roles", function (err, res) {
            //   if (err) throw err;
            //   connection.query("SELECT * FROM employees", function (err, employees) {
            //     if (err) throw err;
              connection.query("SELECT employees.id, employees.first_name, employees.last_name, roles.title FROM employees LEFT JOIN roles ON employees.role_id = roles.id", function (err, employees) {
                  if (err) throw err;
                  printTable(employees);
                  ask.prompt(
                    {
                      type: "list",
                      message: "Please select the manager of whom you wish to view their employees:",
                      choices: employees.map(employee => ({ value: employee.id, name: employee.last_name })),
                      name: "viewMngrsEmps"
                    }
                  ).then(answer => {
                    connection.query("SELECT * FROM employees WHERE ?", [{
                      manager_id: answer.viewMngrsEmps
                    }], function (err, res) {
                      if (err) throw err;
                      printTable(res);
                      console.log("Employee's manager has been updated!");
                      inquireQ();
                    });
                  });
                });
            //   });
            // });
 
            break;

            case "Delete Department":
                connection.query("SELECT * FROM departments ", function (
                  err,
                  departments
                ) {
                  if (err) throw err;
                  ask
                    .prompt(
                      {
                        type: "list",
                        message: "Please select the department you wish to delete:",
                        choices: departments.map(department => ({ value: department.id, name: department.name })),
                        name: "deleteDept"
                      }
                    )
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
                              printTable(res);
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
                  roles
                ) {
                  if (err) throw err;
                  ask
                    .prompt([
                      {
                        type: "list",
                        message: "Please select the role you wish to delete:",
                        choices: roles.map(role => ({ value: role.id, name: role.title })),
                        name: "deleteRole"
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
                              printTable(res);
                              inquireQ();
                            }
                          );
                        }
                      );
                    });
                });
            break;

            case "Delete Employee":
                connection.query("SELECT * FROM employees", function (err, employees) {
                  if (err) throw err;
                  ask
                    .prompt([
                      {
                        type: "list",
                        message: "Please select the employee you wish to delete:",
                        choices: employees.map(employee => ({ value: employee.id, name: employee.last_name })),
                        name: "deleteEmp"
                      }
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
                            printTable(res);
                            inquireQ();
                          });
                        }
                      );
                    });
                });
            break;
          
          case "View Budget by Department":
            connection.query("SELECT * FROM departments", function (err, table) {
              ask.prompt({
                type: "list",
                message: "Please select the department's budget you wish to view",
                choices: table.map(department => ({ value: department.id, name: department.name })),
                name: "budget"
              }).then(answer => {
                connection.query("SELECT departments.id, roles.id AS role_id, roles.salary, employees.last_name FROM departments INNER JOIN roles ON roles.department_id = departments.id INNER JOIN employees ON employees.role_id = roles.id WHERE departments.id=?", [
                  answer.budget
                ], function (err, departments) {
                    printTable(departments);

                    var salary = departments.reduce((sum, row) =>  sum + row.salary , 0); 

                    console.log(`This departments budget is ${salary}`);
                });
              });
            });

            break;

          case "Finish":
            connection.end();
            break;

          default:
            break;
          //end of switch
        }
      });
}
//use map to create employees, etc
//join is for view departments budgets 
//join department, department id inner join




//the end
cfonts.say("Track Your Employee's!", {
  font: "pallet",
  align: "left",
  colors: ["yellow", "magenta"],
  background: "transparent",
  letterSpacing: 1,
  lineHeight: 1,
  space: true,
  maxLength: "0",
  gradient: true,
  independentGradient: false,
  transitionGradient: false,
  env: "node",
});

module.exports = inquireQ;
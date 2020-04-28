const ask = require('inquirer');
const validator = require('validator');
const cfonts = require('cfonts');
const connection = require('./db/connect');
const { printTable } = require("console-table-printer");
const util = require('util');
//promisifying the connection for async await
connection.query = util.promisify(connection.query);
//connection
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    inquireQ();
});
//all questions/cases in this function
const inquireQ = () => {
    ask.prompt([
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
                "View Budget by Department",
                "Finish",
            ],
            name: "userFunction",
        },
        //setting up the async
    ]).then(async res => {
        const userFunction = res.userFunction;
        //begin async
        try {
            //switch case for all options
            switch (userFunction) {

                case "Finish":
                    connection.end();
                    break;
            
                case "Add Department":
                    const { department } = await ask.prompt({
                        type: "input",
                        message: "Please enter the department you wish to add:",
                        name: "department"
                    });
                    await connection.query(
                        "INSERT INTO departments SET ?",
                        {
                            name: department,
                        });
                    console.log("Successfully added department!");
                    const showDpt = await connection.query("SELECT * FROM departments");
                    printTable(showDpt);
                    inquireQ();
                                    
                    break;

                case "View Departments":
                    const viewDept = await connection.query("SELECT * FROM departments");
                    printTable(viewDept);
                    inquireQ();
                    break;

                case "Add Role":
                    const dept1 = await connection.query("SELECT * FROM departments");
                    const addRole = await ask.prompt([
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
                            choices: dept1.map(department => ({ value: department.id, name: department.name })),
                            name: "department_id"

                        }]);
                    await connection.query("INSERT INTO roles SET ?",
                        {
                            title: addRole.title,
                            salary: addRole.salary,
                            department_id: addRole.department_id,
                        });
                    console.log("Successfully added role!");
                    const roleAdded = await connection.query("SELECT roles.id, roles.title, departments.name AS department FROM roles INNER JOIN departments ON roles.department_id = departments.id");
                    printTable(roleAdded);
                    inquireQ();
                    break;

                case "View Roles":
                    const viewRoles = await connection.query("SELECT roles.id, roles.title, roles.salary, departments.name AS department FROM roles INNER JOIN departments ON roles.department_id = departments.id");
                    printTable(viewRoles);
                    inquireQ();
                    break;

                case "Add Employee":
                    //view employees before you add one.
                    const roles = await connection.query("SELECT * FROM roles");
                    const employees = await connection.query("SELECT * FROM employees");
                    //ask the questions to add after displaying current ones, for selecting manager
                    const addEmp = await ask.prompt([
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
                    ]);
                    await connection.query("INSERT INTO employees SET ?",
                        {
                            first_name: addEmp.first_name,
                            last_name: addEmp.last_name,
                            role_id: addEmp.role_id,
                            manager_id: addEmp.manager_id
                        });
                    console.log("Successfully added employee!");
                    const viewRes = await connection.query("SELECT employees.id, employees.first_name, employees.last_name, roles.title, manager_id FROM employees INNER JOIN roles ON employees.role_id = roles.id");
                    printTable(viewRes);
                    inquireQ();
                    break;

                case "View Employees":
                    const viewEmps = await connection.query("SELECT employees.id, employees.first_name, employees.last_name, roles.title, manager_id FROM employees INNER JOIN roles ON employees.role_id = roles.id");

                    printTable(viewEmps);
                    inquireQ();
                    break;

                case "Update Employee Roles":
                    const emps2 = await connection.query("SELECT * FROM employees");
                    const roles2 = await connection.query("SELECT * FROM roles");
                    const joinQ = await ask.prompt([
                        {
                            type: "list",
                            message: "Please select the employee you wish to update:",
                            choices: emps2.map(employee => ({ value: employee.id, name: employee.last_name })),
                            name: "updateID"

                        },
                        {
                            type: "list",
                            message: "Please enter their new role id:",
                            choices: roles2.map(role => ({ value: role.id, name: role.title })),
                            name: "updateRoleID"

                        }
                    ])
                    await connection.query("UPDATE employees SET ? WHERE ?", [{
                        role_id: joinQ.updateRoleID
                    },
                    {
                        id: joinQ.updateID
                    }]);
                    const join1 = await connection.query("SELECT employees.id, employees.first_name, employees.last_name, roles.title FROM employees LEFT JOIN roles ON employees.role_id = roles.id");
                    printTable(join1);
                    console.log("Successfully updated!");
                    inquireQ();
                                    
                    break;

                case "Update Employee Managers":
                    const joinEmps = await connection.query("SELECT employees.id, employees.first_name, employees.last_name, employees.manager_id, roles.title FROM employees LEFT JOIN roles ON employees.role_id = roles.id");
                    printTable(joinEmps);
                    const updateMngrs = await ask.prompt([
                        {
                            type: "list",
                            message: "Please select the employee who's manager you'd like to change:",
                            choices: joinEmps.map(employee => ({ value: employee.id, name: employee.last_name })),
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
                    ]);

                    await connection.query("UPDATE employees SET ? WHERE ?",
                        [{
                            manager_id: updateMngrs.updateMngrID,
                        },
                        {
                            id: updateMngrs.updateMngr
                        },
                        ]);
                    console.log("Employee's manager has been updated!");
                    inquireQ();

                    break;

                case "View Employees by Manager":
                    const viewJoin = await connection.query("SELECT employees.id, employees.first_name, employees.last_name, roles.title FROM employees LEFT JOIN roles ON employees.role_id = roles.id");
                    printTable(viewJoin);
                    const { viewByMngr } = await ask.prompt(
                        {
                            type: "list",
                            message: "Please select the manager of whom you wish to view their employees:",
                            choices: employees.map(employee => ({ value: employee.id, name: employee.last_name })),
                            name: "viewMngrsEmps"
                        }
                    );
                    const view = await connection.query("SELECT * FROM employees WHERE ?", [{
                        manager_id: viewByMngr
                    }]);
                        printTable(view);
                        inquireQ();

                    break;

                case "Delete Department":
                    const dept2 = await connection.query("SELECT * FROM departments ");
                    const { deleteDept } = await ask.prompt({
                            type: "list",
                            message: "Please select the department you wish to delete:",
                            choices: dept2.map(department => ({ value: department.id, name: department.name })),
                            name: "deleteDept"
                        });
                    await connection.query("DELETE FROM departments WHERE id=? ", [deleteDept]);

                    const viewRemain = await connection.query("SELECT * FROM departments");
                            printTable(viewRemain);
                            inquireQ();

                    break;

                case "Delete Role":
                    const role = await connection.query("SELECT * FROM roles ")
                    const { deleteRole } = await ask.prompt([
                        {
                            type: "list",
                            message: "Please select the role you wish to delete:",
                            choices: role.map(role => ({ value: role.id, name: role.title })),
                            name: "deleteRole"
                        }
                    ]);
                            
                    await connection.query("DELETE FROM roles WHERE id=? ", [deleteRole]);
                    const viewChange = await connection.query("SELECT * FROM roles");
                                printTable(viewChange);
                                inquireQ();
                    break;

                case "Delete Employee":
                    const empDel = await connection.query("SELECT * FROM employees");
                    const { deleteEmp } = await ask.prompt({
                        type: "list",
                        message: "Please select the employee you wish to delete:",
                        choices: empDel.map(employee => ({ value: employee.id, name: employee.last_name })),
                        name: "deleteEmp"
                    });

                    await connection.query("DELETE FROM employees WHERE id=? ", [deleteEmp]);
                    const viewEmpsLeft = await connection.query("SELECT * FROM employees")
                            printTable(viewEmpsLeft);
                            inquireQ();
                    break;

                case "View Budget by Department":
                    const budgetDept = await connection.query("SELECT * FROM departments");
                    const { budget } = await ask.prompt({
                        type: "list",
                        message: "Please select the department's budget you wish to view",
                        choices: budgetDept.map(department => ({ value: department.id, name: department.name })),
                        name: "budget"
                    });
                    const budgetView = await connection.query("SELECT departments.id, roles.id AS role_id, roles.salary, employees.last_name FROM departments INNER JOIN roles ON roles.department_id = departments.id INNER JOIN employees ON employees.role_id = roles.id WHERE departments.id=?", [budget]);
                    
                    printTable(budgetView);
                    let salary = budgetView.reduce((sum, row) => sum + row.salary, 0);
                    console.log(`This departments budget is ${salary}`);
                    inquireQ();

                    break;

                default:
                    break;
                //end of switch
            }
            //end of try
        } catch (err) { console.log(err) };
    });
//end of whole function
};


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

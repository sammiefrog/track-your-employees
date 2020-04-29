const app = require('../app.js');
const connection = require('./connect');

    
class db {
    constructor(connection) {
        this.connection = connection;

    }

    getDepartments() {
        return this.connection.query("SELECT * FROM departments");
    }

    addDepartment(department) {
        return this.connection.query(
            "INSERT INTO departments SET ?",
            {
                name: department,
            });
    }

    getRoles() {
        return this.connection.query("SELECT * FROM roles");
    }

    getRolesWithDepts() {
        return this.connection.query("SELECT roles.id, roles.title, roles.salary, departments.name AS department FROM roles INNER JOIN departments ON roles.department_id = departments.id");
    }

    addRole(addRole) {
        return this.connection.query("INSERT INTO roles SET ?",
            {
                title: addRole.title,
                salary: addRole.salary,
                department_id: addRole.department_id,
            });
    }

    getEmployees() {
        return this.connection.query("SELECT * FROM employees");
    }

    getEmpsWithRoles() {
        return this.connection.query("SELECT employees.id, employees.first_name, employees.last_name, roles.title, manager_id FROM employees INNER JOIN roles ON employees.role_id = roles.id");
    }

    addEmployee(addEmp) {
        return this.connection.query("INSERT INTO employees SET ?",
            {
                first_name: addEmp.first_name,
                last_name: addEmp.last_name,
                role_id: addEmp.role_id,
                manager_id: addEmp.manager_id
            });
    }
    


}

module.exports = new db(connection);
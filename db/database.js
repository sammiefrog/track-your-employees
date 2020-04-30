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

    deleteDepartment(deleteDept) {
        return this.connection.query("DELETE FROM departments WHERE id=? ", [deleteDept]);
    }

    viewDeptBudget(budget) {
        return this.connection.query("SELECT departments.id, roles.id AS role_id, roles.salary, employees.last_name FROM departments INNER JOIN roles ON roles.department_id = departments.id INNER JOIN employees ON employees.role_id = roles.id WHERE departments.id=?", [budget])
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

    deleteRole(deleteRole) {
        return this.connection.query("DELETE FROM roles WHERE id=? ", [deleteRole]);
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

    viewEmpsByMngr(viewByMngr) {
        return this.connection.query("SELECT * FROM employees WHERE ?", [{
            manager_id: viewByMngr
        }]);
    }
    updateEmpMngrs(updateMngrs) {
        return this.connection.query("UPDATE employees SET ? WHERE ?",
            [{
                manager_id: updateMngrs.updateMngrID,
            },
            {
                id: updateMngrs.updateMngr
            },
            ]);
    }
    updateEmpRoles(joinQ) {
        return this.connection.query("UPDATE employees SET ? WHERE ?", [{
            role_id: joinQ.updateRoleID
        },
        {
            id: joinQ.updateID
        }]);
    }

    deleteEmployee(deleteEmp) {
        return this.connection.query("DELETE FROM employees WHERE id=? ", [deleteEmp]);
    }


}

module.exports = new db(connection);
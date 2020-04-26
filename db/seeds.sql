
USE employee_trackerDB;


INSERT INTO departments (name)
VALUES ("Finance");

INSERT INTO roles (title, salary, department_id)
VALUES ("Manager", 30000.00, 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Janet", "Smith", 1, null);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Bob", "Barker", 1, 1);
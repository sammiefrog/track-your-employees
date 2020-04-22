DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE department (
  id INT(30) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
);

CREATE TABLE role (
  id INT(30) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(45) NOT NULL,
  salary  DECIMAL NOT NULL,
  department_id INT(30) NOT NULL,
);

CREATE TABLE  employee (
  id INT(30) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT(30) NOT NULL,
  manager_id INT(30)
);


INSERT INTO department (name)
VALUES ("Finance");

INSERT INTO roles (title, salary, department_id)
VALUES ("Manager", 30000.00, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Janet", "Smith", 1, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Bob", "Barker", 1, 1);
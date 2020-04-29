DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE departments (
  id INT(30) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
  id INT(30) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(45) NOT NULL,
  salary  DECIMAL NOT NULL,
  department_id INT(30) NOT NULL,
  CONSTRAINT fk_departments FOREIGN KEY(department_id) REFERENCES departments(id) ON DELETE CASCADE
);

CREATE TABLE  employees (
  id INT(30) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT(30) NOT NULL,
  manager_id INT(30),
  CONSTRAINT fk_roles FOREIGN KEY(role_id) REFERENCES roles(id) ON DELETE CASCADE,
  CONSTRAINT fk_mngr FOREIGN KEY(manager_id) REFERENCES employees(id) ON DELETE CASCADE
);

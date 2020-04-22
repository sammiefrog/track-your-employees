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
  department_Id INT(30) NOT NULL,
);
CREATE TABLE  employee(
  id INT(30) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT(30) NOT NULL,
  manager_id INT(30)
);


-- INSERT INTO songs (title, artist, genre)
-- VALUES ("Best of Me", "The Starting Line", "Pop Punk");

-- INSERT INTO songs (title, artist, genre)
-- VALUES ("Can We Talk", "Tevin Campbell", "R&B");

-- INSERT INTO songs (title, artist, genre)
-- VALUES ("Southern Hospitality", "Ludacris", "Hip-Hop");
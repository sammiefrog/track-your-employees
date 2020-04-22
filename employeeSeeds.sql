DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE department (
  id INTEGER NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);
CREATE TABLE role (
  id INTEGER NOT NULL AUTO_INCREMENT,
  title VARCHAR(45) NOT NULL,
  salary  NOT NULL,
  department id INTEGER VARCHAR(45) NOT NULL,
  PRIMARY KEY (id)
);
CREATE TABLE  employee(
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER NOT NULL,
  manager_id INTEGER
  PRIMARY KEY (id)
);


-- INSERT INTO songs (title, artist, genre)
-- VALUES ("Best of Me", "The Starting Line", "Pop Punk");

-- INSERT INTO songs (title, artist, genre)
-- VALUES ("Can We Talk", "Tevin Campbell", "R&B");

-- INSERT INTO songs (title, artist, genre)
-- VALUES ("Southern Hospitality", "Ludacris", "Hip-Hop");
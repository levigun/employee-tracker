-- department table
INSERT INTO department (dept) VALUES ('Front of House');
INSERT INTO department (dept) VALUES ('Back of House');
INSERT INTO department (dept) VALUES ('Manager');
INSERT INTO department (dept) VALUES ('Sales');

-- role table
INSERT INTO role (title, salary, department_id) VALUES ('Waiter', 56000, 1);
INSERT INTO role (title, salary, department_id)  VALUES ('Chef', 65000, 2);
INSERT INTO role (title, salary, department_id)  VALUES ('Head Chef', 120000, 3);
INSERT INTO role (title, salary, department_id)  VALUES ('Accountant', 85000, 4);
INSERT INTO role (title, salary, department_id)  VALUES ('General Manager', 120000, 3);

-- employee table
INSERT INTO employee (first_name, last_name, role_id) values ('Santiago', 'Aristizabal', 3);
INSERT INTO employee (first_name, last_name, role_id) values ('Oliver', 'Atkins', 5);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Cleo', 'Hall', 1, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Sherline', 'Twain', 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Jill', 'Mavis', 1, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Shruti ', 'Punja', 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Darcy', 'Marks', 4, 2);
-- department table
INSERT INTO department (department) VALUES ('Front of House');
INSERT INTO department (department) VALUES ('Back of House');
INSERT INTO department (department) VALUES ('Manager');
INSERT INTO department (department) VALUES ('Sales');

-- role table
INSERT INTO roles (title, salary, department_id) VALUES ('Waiter', 56000, 1);
INSERT INTO roles (title, salary, department_id)  VALUES ('Chef', 65000, 2);
INSERT INTO roles (title, salary, department_id)  VALUES ('Head Chef', 120000, 3);
INSERT INTO roles (title, salary, department_id)  VALUES ('Accountant', 85000, 4);
INSERT INTO roles (title, salary, department_id)  VALUES ('General Manager', 120000, 3);

-- employee table
INSERT INTO employee (first_name, last_name, role_id) values ('Santiago', 'Aristizabal', 3);
INSERT INTO employee (first_name, last_name, role_id) values ('Oliver', 'Atkins', 5);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Cleo', 'Hall', 1, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Sherline', 'Twain', 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Jill', 'Mavis', 1, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Shruti ', 'Punja', 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Darcy', 'Marks', 4, 2);
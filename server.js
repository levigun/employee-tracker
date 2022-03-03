const connect = require('./lib/connection');
const inquirer = require('inquirer');
const questions = require('./lib/questions');
require('dotenv').config();

// called out function init at the beginning of the page
init();


// created function init
async function init() {
    const { action } = await inquirer.prompt(questions);
    switch (action) {
        case "Update Department":
            return updateDepartment();
        case "Update Roles":
            return updateRoles();
        case "Update Employee":
            return updateEmployee();
        case "View Information":
            return viewInfo();
        case "Exit",
            process.exit(0):
            break;
        default:
            break;
    }
}


// update department function
async function updateDepartment() {
    const { department } = await inquirer.prompt({
        type: "list",
        name: "department",
        message: "Choose one of the following updates:",
        choices: ["Add department", "Remove Department", "Exit"]
    })
    if (department === "Add department") {
        return addDepartment();
    }
    if (department === "Remove Department") {
        return delDepartment();
    }
    if (department === "Exit") {
        return init();
    }
};

async function addDepartment() {
    const department = await inquirer.prompt({
        type: "input",
        name: "department",
        message: " What department do you want to add?",
    });

    const connection = await connect();

    const input = department.department;

    connection.execute("INSERT INTO  department SET `department` = ?",
        [input]
    )
        .then(function () {
            init();
        })
}

async function delDepartment() {
    const connection = await connect();
    const [results] = await connection.execute("SELECT * FROM department");
    const input = await inquirer.prompt([
        {
            type: "list",
            name: "del_department",
            message: "Which department would you like to delete?",
            choices: results.map((department) => {
                return {
                    name: department.department,
                    value: department.id
                }
            })
        },
    ]);

    const delDept = input.del_department;
    connection.execute(`DELETE FROM department WHERE id = ${delDept};`)
        .then(function () {
            init();
        })
};

// update roles function

async function updateRoles() {

    const { roles } = await inquirer.prompt({
        type: "list",
        name: "roles",
        message: "Choose one of the following updates:",
        choices: ["Add Role", "Delete Role", "Edit Role", "Exit"]
    })
    if (roles === "Add Role") {
        return addRole();
    }
    if (roles === "Edit Role") {
        return editRole();
    }
    if (roles === "Delete Role") {
        return delRoles();
    }
    if (roles === "Exit") {
        return init();
    }
}

async function addRole() {
    const connection = await connect();
    const [departments] = await connection.query(
        "SELECT * FROM department"
    )
    const input = await inquirer.prompt([
        {
            type: "list",
            name: "department",
            message: "Which department is this role in?",
            choices: departments.map((dept) => ({ name: dept.department, value: dept.id }))
        },
        {
            type: "input",
            name: "title",
            message: "What roles do you want to add?"
        },
        {
            type: "number",
            name: "salary",
            message: "What is the salary for this role?"
        },
    ])

    const title = input.title;
    const salary = input.salary;
    const deptId = input.department;

    connection.query(
        `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`, [title, salary, deptId])

        .then(function () {
            init();
        })

};

async function delRoles() {
    const connection = await connect();
    const [roles] = await connection.query("SELECT * FROM roles")

    const input = await inquirer.prompt([
        {
            type: "list",
            name: "removedRoles",
            message: "Which role would you like to delete?",
            choices: roles.map((role) => ({
                name: role.title, value: role.id
            })),
        },
    ]);

    connection.query(
        "DELETE FROM roles WHERE id = ?", input.removedRoles)


        .then(function () {
            init();
        })

}

async function editRole() {
    const connection = await connect();
    const [employees] = await connection.query(
        "SELECT first_name, last_name, id FROM employee ")
    const [roles] = await connection.query(
        "SELECT id, title, salary FROM roles ")
    const input = await inquirer.prompt([
        {
            type: "list",
            name: "employee",
            message: "Select which employee you want to update its role",
            choices: employees.map((employee) => ({
                name: employee.first_name + " " + employee.last_name, value: employee.id
            })),
        },
        {
            type: "list",
            name: "role",
            message: "Select the employee's new role",
            choices: roles.map((row) => ({ name: row.title, value: row.id })),
        },
    ])

    const newRoles = input.role;
    const updateEmployee = input.employee;

    connection.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [newRoles, updateEmployee])

        .then(function () {
            init();
        })
};


// update employee function

async function updateEmployee() {

    const { employee } = await inquirer.prompt({
        type: "list",
        name: "employee",
        message: "What would you like to do?",
        choices: ["Add Employee", "Remove Employee", "Exit"],
    });
    if (employee === "Add Employee") {
        return addEmployee();
    }
    if (employee === "Remove Employee") {
        return delEmployee();
    }
    if (employee === "Exit") {
        return init();
    }
}

async function addEmployee() {
    const connection = await connect();
    const [roles] = await connection.query("SELECT * FROM roles");
    const [employees] = await connection.query('SELECT * FROM employee');

    const newEmployee = await inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "What is the employee's first name?",
        },
        {
            type: "input",
            name: "lastName",
            message: "What is the employee's last name?",
        },
        {
            type: "list",
            name: "roleID",
            message: "What is the employee's role?",
            choices: roles.map((roles) => ({ name: roles.title, value: roles.department_id }))
        },
        {
            type: "list",
            name: "managerID",
            message: "Who is the manager?",
            choices: [
                { name: 'No manager', value: null },
                ...employees.map((employee) => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }))]
        },
    ]);

    console.log(newEmployee);

    const name1 = newEmployee.firstName;
    const name2 = newEmployee.lastName;
    const IdOfRole = newEmployee.roleID;
    const IdOfManager = newEmployee.managerID;

    connection.query(`INSERT INTO employee SET ?`, 
       {
        first_name: name1,
        last_name: name2,
        role_id: IdOfRole,
        manager_id: IdOfManager
       }
    )

        .then(function () {
            init();
        })
}

async function delEmployee() {
    const connection = await connect();
    const [employees] = await connection.query("SELECT * FROM employee")

    const input = await inquirer.prompt([
        {
            type: "list",
            name: "removedEmployee",
            message: "Which employee would you like to delete?",
            choices: employees.map((employee) => ({
                name: employee.first_name + " " + employee.last_name, value: employee.id
            })),
        },
    ]);



    connection.query(
        "DELETE FROM employee WHERE id = ?", input.removedEmployee)


        .then(function () {
            init();
        })

}



// view information function

async function viewInfo() {
    const connection = await connect();
    const { view } = await inquirer.prompt({
        type: "list",
        name: "view",
        message: "What would you like to view?",
        choices: ["Department", "Roles", "Employees"]
    });
    let query;

    if (view === "Department") {
        query = `SELECT * FROM department`;
    } else if (view === "Roles") {
        query = `SELECT * FROM roles`
    } else {
        query = `SELECT * FROM employee`;

    }

    const [data] = await connection.query(query);
    console.table(data);
    init();
}



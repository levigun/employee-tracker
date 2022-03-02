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
            updateRoles();
        case "Update Employee":
            updateEmployee();
        case "View Information":
            viewInfo();
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
        delDepartment();
    }
    if (department === "Exit") {
        init();
    }
};

async function addDepartment() {
    const department = await inquirer.prompt({
        type: "input",
        name: "department",
        message: " What department do you want to add?",
    });

    const connection = await connect();

    console.log(connection);
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
        const input = inquirer.prompt([
            {
                type: "list",
                name: "del_department",
                message: "Which department would you like to delete?",
                choices: results.map((department) => {
                    return {
                        name: department.department,
                        value: department.id
                }}),
            },
        ]);
        
    
        console.log(connection);
        await connection.execute(`DELETE FROM department WHERE id = ${input};`)
            .then(function () {
                init();
            })
};

// update roles function

async function updateRoles() {
    const connection = await connect();

    const { roles } = await inquirer.prompt({
        type: "list",
        name: "roles",
        message: "Choose one of the following updates:",
        choices: ["Add Role", "Edit Role", "Exit"]
    })
    if (roles === "Add Role") {
        addRole();
    }
    if (roles === "Edit Role") {
        editRole();
    }
    if (roles === "Exit") {
        init();
    }
}

async function addRole() {
    const connection = await connect();
    const departments = connection.query(
        "SELECT * FROM department"
    )
    const { department, title, salary } = inquirer.prompt([
        {
            type: "list",
            name: "department",
            message: "Which department is this role in?",
            choices: departments.map((department) => ({ name: department.department, value: department.id }))
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
    connection.execute(`INSERT INTO roles (title, salary, department_id) VALUES (${title}, ${salary}, ${department})`)

        .then(function () {
            init();
        })
    
};

async function editRole() {
    const connection = await connect();
    const employee = await connection.query(
        "SELECT first_name, last_name, id FROM employee ")
    const roles = await connection.query(
        "SELECT id, title, salary FROM roles ")
    const { employees, role } = await inquirer.prompt([
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
            choices: role.map((row) => ({ name: row.title, value: row.id })),
        },
    ])
    connection.query(`UPDATE employee SET role_id = ${roles} WHERE id = ${employee}`),

        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " Role Added\n");
            init();
        };
};


// update employee function

async function updateEmployee() {
    const connection = await connect();

    const { employee } = await inquirer.prompt({
        type: "list",
        name: "employee",
        message: "What would you like to do?",
        choices: ["Add Employee", "Remove Employee", "Exit"],
    });
    if (employee === "Add Employee") {
        addEmployee();
    } else if (employee === "Remove Employee") {
        delEmployee();
    } else {
        init();
    }
}

async function addEmployee() {
    const connection = await connect();

    const add = await inquirer.prompt([
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
            choices: ["Waiter", "Chef", "Accountant"]
        },
        {
            type: "confirm",
            name: "managerID",
            message: "Is the employee a manager?",
        },
    ]);
    switch (add.managerID) {
        case true:
            add.managerID = 1;
            break;
        case false:
            add.managerID = null;
            break;
    }
    const query = await connection.query(
        "INSERT INTO employee SET ?",
        {
            first_name: add.firstName,
            last_name: add.lastName,
            role_id: add.roleID,
            manager_id: add.managerID,
        },

        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " Employee Added\n");
            init();
        });
}

async function delEmployee() {
    const connection = await connect();
    connection.query(
        "SELECT first_name, last_name FROM employee",
        async function (err, employees) {
            const input = await inquirer.prompt([
                {
                    type: "list",
                    name: "employees",
                    message: "Which employee would you like to delete?",
                    choices: employees.map((employee) => ({
                        name: employee.first_name + " " + employee.last_name,
                    })),
                },
            ]);
            const firstAndLast = input.employees.split(" ");
            connection.query(
                "DELETE FROM employee WHERE first_name = ? AND last_name = ?",
                [firstAndLast[0], firstAndLast[1]]
            );
            init();
        }
    );
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
        query = `SELECT department FROM department`;
    } else if (view === "Roles") {
        query = `SELECT roles.title, roles.department_id, department.department FROM roles INNER JOIN department ON roles.department_id = department.id`
    } else {
        query = `SELECT employee.first_name, employee.last_name, roles.title, roles.salary, department.department FROM ((employee INNER JOIN roles ON employee.role_id = roles.id) INNER JOIN department ON roles.department_id = department.id) ORDER BY department`;

    }

    const data = await connection.query(query);
    console.table(data);
    init();
}



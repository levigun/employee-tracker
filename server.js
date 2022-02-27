const connection = require("./lib/connection");
const inquirer = require('inquirer');
const console_table = require('console.table');
const questions = require('./lib/questions');

// called out function init at the beginning of the page
init();


// created function init
async function init() {
    const { action } = await inquirer.prompt(questions);
    switch (action) {
        case "Update Department":
            updateDepartment();
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
        addDepartment();
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

    const input = department.department;

    const query = await connection.query(
        "INSERT INTO  department SET ?",
        {
            department: input,
        },

        function (err, res) {
            if (err)
                throw err;
            console.log(res.affectedRows + "Department Added\n");
            init();
        }
    )
}

async function delDepartment() {
    connection.query(
        "SELECT department AS del_department FROM department",
        async function (err, del_department) {
            const input = await inquirer.prompt([
                {
                    type: "list",
                    name: "del_department",
                    message: "Which department would you like to delete?",
                    choices: del_department.map((department) => ({
                        name: department.del_department,
                    })),
                },
            ]);
            connection.query(
                "DELETE FROM department WHERE ?", {
                department: input.del_department,
            }),
                init();
        }
    )
}

// update roles function

async function updateRoles() {

    const { roles } = await inquirer.prompt({
        type: "list",
        name: "roles",
        message: "Choose one of the following updates:",
        choices: ["Add Role", "Edit Role", "Exit"]
    })
    if (department === "Add Role") {
        addRole();
    }
    if (department === "Edit Role") {
        editRole();
    }
    if (department === "Exit") {
        init();
    }
}

async function addRole() {
    const department = await connection.query(
        "SELECT dept, id FROM department"
    )
    const { departments, title, salary } = await inquirer.prompt([
        {
            type: "list",
            name: "department",
            message: "WHich department is this role in?",
            choices: departments.map((row) => ({ name: row.department, value: row.id }))
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
    connection.query(`INSERT INTO roles (title, salary, department_id) VALUES (${title}, ${salary}, ${department})`),

        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " Role Added\n");
            init();
        }
};

async function editRole() {
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
    const { view } = await inquirer.prompt ({
        type: "list",
        name: "view",
        message: "What would you like to view?",
        choices: ["Department", "Roles", "Employees"]
    });
    let query;
    
    if (view === "Department") {
        query = `SELECT department FROM department`;
    } else if (view === "Roles") {
        query = `SELECT roles.title, roles.department_id, department.department FROM roles INNER JOIN department ON role.department_id = department.id`
    } else {
        query = `SELECT employee.first_name, employee.last_name, roles.title, roles.salary, department.department FROM ((employee INNER JOIN role ON employee.role_id = roles.id) INNER JOIN department ON roles.department_id = department.id) ORDER BY department`;

    }

    const data = await connection.query(query);
    console_table(data);
    init();
}



const connection = require("./lib/connection");
const inquirer = require('inquirer');
const questions = require('./lib/questions');

init();

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

// update roles function

// update employee function

// view information function

// exit functi


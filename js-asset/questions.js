const questions = [
    {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
            "Update Employee Managers",
            "View employees by manager",
            "View employees by department",
            "Update Department (can add/delete)",
            "Update Roles (can add/delete)",
            "Update Employee (can add/delete)",
            "View Information",
            "Exit", 
        ]
    }];

    module.exports = questions;
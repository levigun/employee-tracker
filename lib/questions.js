const questions = [
    {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
            "Update Department",
            "Update Roles",
            "Update Employee",
            "View Information",
            "Exit", 
        ]
    }];

    module.exports = questions;
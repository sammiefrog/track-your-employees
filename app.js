const
const

const inquireQ = () => {
    inquirer
        .prompt([
            // build or finish sets up switch case
            {
                type: "list",
                message: "What would you like to do?",
                choices: ["Add Department", "View Department", "Add Roles", "View Roles", "Add Employees", "View Employees", "Update Employee Roles", "Update Employee Managers", "View Employees by Manager", "Delete Departments", "Delete Roles", "Delete Employees"],
                name: "userFunction"
            }
        ]).then(res => {
            const userFunction = res.userFunction;
            //switch case for all options
            switch (userFunction) {
                case "Add Department":
                    break;

                case "View Department":
                    break;

                case "Add Roles":
                    break;

                case "View Roles":
                    break;

                case "Add Employees":
                    break;

                case "View Employees":
                    break;

                case "Update Employee Roles":
                    break;

                case "Update Employee Managers":
                    break;

                case "View Employees by Manager":
                    break;

                case "Delete Departments":
                    break;

                case "Delete Roles":
                    break;

                case "Delete Employees":
                    break;

                default:
                    break;
                    //end of switch
            }
        });
}
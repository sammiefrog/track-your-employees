//importing internal packages
const path = require("path");
const fs = require("fs");

//internal class modules
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const render = require("./lib/htmlRenderer");

//external npm packages installed
const inquirer = require("inquirer");
const validator = require("validator");

//output paths
const OUTPUT_DIR = path.resolve(__dirname, "output")
const outputPath = path.join(OUTPUT_DIR, "team.html");


//empty global array 'team' holds the employee objects as they're made
let team = [];

//the questions all employees must answer
const questions = [{
        type: "input",
        message: "Please enter employee's full name:",
        name: "fullName",
        validate: value => {
            var regName = /^[a-zA-Z]+ [a-zA-Z]+$/;
            if (!regName.test(value)) {
                return "'Please enter your first & last name";
            }
            return true;
        }
    },
    {
        type: "input",
        message: "Please employee's id numer:",
        name: "id",
        validate: value => {
            if (validator.isInt(value)) {
                return true;
            }
            return "Please enter a valid ID Number.";
        }
    },
    {
        type: "input",
        message: "Please enter employee's email:",
        name: "email",
        validate: value => {
            if (validator.isEmail(value)) {
                return true;
            }
            return "Please enter a valid e-mail address.";
        }
    },
    {
        type: "list",
        message: "Select employee's role:",
        choices: ['Manager', 'Engineer', 'Intern'],
        name: "role"
    }
];

const inquireQ = () => {
    inquirer
        .prompt([
            // build or finish sets up switch case
            {
                type: "list",
                message: "What would you like to do?",
                choices: ["Build team", "Finish team"],
                name: "moreTeam"
            }
        ]).then(res => {
            const moreTeam = res.moreTeam;
            //switch case dependent on whether user picks build team or finish
            switch (moreTeam) {
                case "Build team":
                    inquirer.prompt(questions)
                        .then(response => {
                            //adds three separate questions based on role response
                            if (response.role === "Manager") {
                                inquirer.prompt({
                                    type: "input",
                                    message: "What is the manager's office number?",
                                    name: "officeNum",
                                    validate: value => {
                                        if (validator.isInt(value)) {
                                            return true;
                                        }
                                        return "Please enter a valid office number.";
                                    }
                                }).then(managerOffice => {
                                    let newManager = new Manager(response.fullName, response.id, response.email, managerOffice.officeNum);
                                    team.push(newManager);
                                    console.log(team);
                                    inquireQ();
                                })
                            } else if (response.role === "Engineer") {
                                inquirer.prompt({
                                    type: "input",
                                    message: "What is the engineer's github user name??",
                                    name: "github",
                                    validate: value => {
                                        var regExp = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
                                        if (!regExp.test(value)) {
                                            return "'Please enter a valid github username";
                                        }
                                        return true;
                                    }
                                }).then(engineerGH => {
                                    let newEngineer = new Engineer(response.fullName, response.id, response.email, engineerGH.github);
                                    team.push(newEngineer);
                                    inquireQ();
                                });
                            } else if (response.role === "Intern") {
                                inquirer.prompt({
                                    type: "input",
                                    message: "What school did this intern attend?",
                                    name: "school"
                                }).then(internSchool => {
                                    let newIntern = new Intern(response.fullName, response.id, response.email, internSchool.school);
                                    team.push(newIntern);
                                    console.log(team);
                                    inquireQ();
                                });
                            }
                            //each role above pushes an object to array 'team'
                        });
                    //end of first case
                    break;
                case "Finish team":
                    if (team.length > 0) {
                        //calling the function to make html page with the info from render()
                        writeHTML(render(team));
                        console.log("All done!")
                    } else {
                        console.log("There's no Team Members!");
                        inquireQ();
                    }
                    break;

                default:
                    break;
                    //end of switch
            }
        });
}

//writing a file to the output path, with the html that was rendered
const writeHTML = HTML => {
    fs.writeFileSync(outputPath, HTML, err => {
        if (err) {
            return console.log(err);
        }
    });
}
//calling the inquire function
inquireQ();
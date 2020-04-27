const app = require('app.js');
const ask = require('inquirer');


    
    const addDept = () => {
        ask.prompt({
            type: "input",
            message: "Please enter the department you wish to add:",
            name: "department"
        }).then((answer) => {
            connection.query(
                "INSERT INTO departments SET ?",
                {
                    name: answer.department,
                },
                function (err) {
                    if (err) throw err;
                    console.log("Successfully added department!");
                    connection.query(
                        "SELECT * FROM departments",
                        function (err, res) {
                            if (err) throw err;
                            res.length > 0 && printTable(res);
                            inquireQ();
                        }
                    );
                });
        });
    }

module.exports = addDept;
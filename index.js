const inquirer = require('inquirer');
const logo = require("asciiart-logo");

const db = require('./db/connection');

console.log('starting CLI..');

db.connect().then((result) => {
}).catch((error) => {
  console.log(error)
});

function startCLI() {
  inquirer.prompt([
    /* Pass your questions in here */
    {
      type: 'list',
      name: 'menu',
      choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update Employee Role'],
      message: 'What would you like to do?',
    }
  ])
    .then((answers) => {
      // Use user feedback for... whatever!!
      if (answers.menu === "View All Departments") {
        db.query("select * from department", (err, { rows }) => {
          console.table(rows);
          startCLI();
        })
      }
      if (answers.menu === "View All Roles") {
        db.query("select * from role", (err, response) => {
          if (err)
            throw (err)
          console.table(response.rows);
          startCLI();
        })
      }
      if (answers.menu === "View All Employees") {
        db.query("select * from employee", (err, { rows }) => {
          console.table(rows);
          startCLI();
        })
      }
      if (answers.menu === "Add A Department") {
        inquirer.prompt([
          {
            type: 'input',
            name: 'deptName',
            message: "Please Enter Department Name",
          }

        ])
          .then(res => {
            db.query("insert into department (name) values($1)", [res.deptName], (err) => {
              console.log("Your Department has been added");
              startCLI();
            })
          })
      }
      if (answers.menu === "Add A Role") {
        inquirer.prompt([
          {
            type: 'input',
            name: 'roleName',
            message: "Please Enter a Role",
          },
          {
            type: 'input',
            name: 'salary',
            message: 'Please enter a salary amount',
          },
          {
            type: 'input',
            name: 'department',
            message: 'Please enter a department',
          }

        ])
          .then(res => {
            db.query("insert into role (title, salary, department_id) values($1, $2, $3)", [res.roleName, res.salary, res.department], (err) => {
              if (err)
                throw (err)
              console.log("Your Role has been added");
              startCLI();
            })
          })
      }
      if (answers.menu === "Update Employee Role") {
        db.query('select id, title from role', (err, {rows}) => {
          let roles = rows.map(role => ({name: role.title, value: role.id}))
          db.query('select first_name, last_name, id from employee', (err, {rows}) => {
            let employees = rows.map(employee => ({name: employee.first_name + " " + employee.last_name, value: employee.id}))
            inquirer.prompt([
              {
                type: 'list',
                name: 'roleUpdate',
                message: "Please Enter Employee updated Role",
                choices: roles,
              },
              {
                type: 'list',
                name: 'employeeUpdate',
                message: "Please Enter updated employee information",
                choices: employees,
              },
            ])
            .then(res => {
              db.query("update employee set role_id = $1 where id = $2", [res.roleUpdate, res.employeeUpdate], (err) => {
                if (err)
                  throw (err)
                console.log("Your Role has been added");
                startCLI();
              })
            })
          })
        })
        }

      if (answers.menu === "Add An Employee") {
        inquirer.prompt([
          {
            type: 'input',
            name: 'employeeFirstName',
            message: "Please Enter Employee first Name",
          },
          {
            type: 'input',
            name: 'employeeLastName',
            message: 'Please enter Employee last name', 
          },
          {
            type: 'input',
            name: 'roleName',
            message: 'Please enter employee Role',
          },
          {
            type: 'input',
            name: 'managerId',
            message: 'Please enter Manager ID',
          },
          ])
          .then(res => {
            db.query("insert into employee (first_name, last_name, role_id, manager_id) values($1, $2, $3, $4)", [res.employeeFirstName, res.employeeLastName, res.roleName, res.managerId], (err) => {
              if (err)
                throw (err)
              console.log("Your Department has been added");
              startCLI();
            })
          })
      }
    })
    
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
        console.log(error.isTtyError);
      } else {
        // Something else went wrong
        console.log(error);
      }
    });
}



function init() {
  startCLI();
}

init();
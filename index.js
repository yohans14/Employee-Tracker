const inquirer = require("inquirer");
const db = require("./config/connection");
table = require("console.table");

const manage = () => {
	inquirer
		.prompt([
			{
				type: "list",
				name: "manage",
				message: "What would you like to do?",
				choices: [
					"View All Departments",
					"View All Roles",
					"View All Employees",
					"Add Department",
					"Add Role",
					"Add Employee",
					"Update Employee Role",
					"Exit",
				],
			},
		])
		.then((manageChoice) => {
			switch (manageChoice.manage) {
				case "View All Departments":
					console.log("Here is All Departments");
					viewDepartments();
					break;
				case "View All Roles":
					console.log("Here is All Roles");
					viewRoles();
					break;
				case "View All Employees":
					console.log("Here is All Employees");
					viewEmployees();
					break;
				case "Add Department":
					console.log("Adding Department to the database");
					addDepartment();
					break;
				case "Add Role":
					console.log("Adding Role to the database");
					addRole();
					break;
				case "Add Employee":
					console.log("Adding Employee to the database");
					AddEmployee();
					break;
				case "Update Employee Role":
					console.log("Updating Employee Role");
					updateRole();
					break;
				case "Exit":
					console.log("All done");
					db.end();
					break;
			}
		});
};

const viewDepartments = () => {
	db.query(
		`SELECT department_name, department_id FROM department`,
		(err, result) => {
			if (err) throw err;
			// if no err print the table
			console.table(result);
			console.log("Next");
			manage();
		}
	);
};

const viewRoles = () => {
	db.query(
		`SELECT employee_role.role_id, employee_role.job_title, department_name AS department,
          employee_role.salary FROM employee_role LEFT JOIN department ON department.department_id = employee_role.department_id`,
		(err, result) => {
			if (err) throw err;
			console.table(result);
			console.log("Next");
			manage();
		}
	);
};

const viewEmployees = () => {
	db.query(
		`SELECT employee.employee_id, employee.first_name, employee.last_name,
    employee_role.job_title AS title, department.department_name AS department,
    employee_role.salary, CONCAT(manager.first_name," ",manager.last_name) AS manager
    from employee LEFT JOIN employee_role ON employee.role_id = employee_role.role_id
    LEFT JOIN department On employee_role.department_id = department.department_id 
    LEFT JOIN employee manager ON
    manager.employee_id = employee.manager_id`,
		(err, result) => {
			if (err) throw err;
			console.table(result);
			console.log("Next");
			manage();
		}
	);
};

const addDepartment = () => {};
const addRole = () => {};
const AddEmployee = () => {};

const updateRole = () => {};

manage();

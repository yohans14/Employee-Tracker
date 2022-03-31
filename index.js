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
					console.log("All done, Thank You!");
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
const addDepartment = () => {
	inquirer
		.prompt([
			{
				name: "department",
				type: "input",
				message: "What is the new department name",
				// validate the input
				validate: (addDepartment) => {
					if (addDepartment) {
						return true;
					} else {
						console.log("Please enter the department name!");
					}
				},
			},
		])
		.then((answer) => {
			db.query(
				`INSERT INTO department(department_name) VALUE (?)`,
				[answer.department],
				(err) => {
					if (err) throw err;
					console.log(
						answer.department + " " + "was add to the department table"
					);
					// call allDepartment function to check if the user want to insert another input
					viewDepartments();
				}
			);
		});
};
const addRole = () => {
	inquirer
		.prompt([
			{
				name: "job_title",
				type: "input",
				message: "What is the name of the role?",
				validate: (answer) => {
					if (answer) {
						return true;
					} else {
						console.log("Please put the name of the role!");
						return false;
					}
				},
			},
			{
				name: "salary",
				type: "input",
				message: "What is the salary of this role",
				validate: (answer) => {
					if (answer) {
						return true;
					} else {
						console.log("Please put the salary of this role!");
						return false;
					}
				},
			},
		])
		.then((answers) => {
			const newRole = [answers.job_title, answers.salary];

			let departments = `SELECT department.department_id, department.department_name FROM department`;
			db.query(departments, (err, results) => {
				if (err) throw err;

				const departmentArr = results.map(
					({ department_id, department_name }) => ({
						name: department_name,
						value: department_id,
					})
				);
				inquirer
					.prompt([
						{
							name: "department",
							type: "list",
							message: "Which department does the role belong to",
							choices: departmentArr,
						},
					])
					.then((selectedDepartment) => {
						const departmentId = selectedDepartment.department;
						newRole.push(departmentId);

						const newRoleToAdd = `INSERT INTO employee_role(job_title, salary, department_id) VALUE (?,?,?)`;
						db.query(newRoleToAdd, newRole, (err) => {
							if (err) throw err;
							console.log("Added a new roll to the database!");
							console.log("Next");
							manage();
						});
					});
			});
		});
};

const AddEmployee = () => {
	inquirer
		.prompt([
			{
				name: "first_name",
				type: "input",
				message: "What is employee's first name?",
				validate: (isFirstname) => {
					if (isFirstname) {
						return true;
					} else {
						console.log("Please enter employee first name");
						return false;
					}
				},
			},
			{
				name: "last_name",
				type: "input",
				message: "What is employee's last Name?",
				validate: (isLasrName) => {
					if (isLasrName) {
						return true;
					} else {
						console.log("Please enter employee last name");
						return false;
					}
				},
			},
		])
		.then((answer) => {
			const newEmployee = [answer.first_name, answer.last_name];

			let roles = `SELECT employee_role.role_id, employee_role.job_title FROM employee_role`;
			db.query(roles, (err, result) => {
				if (err) throw err;

				const rolesArr = result.map(({ role_id, job_title }) => ({
					name: job_title,
					value: role_id,
				}));
				inquirer
					.prompt([
						{
							type: "list",
							name: "role",
							message: "Pleas select the job title",
							// using role array to allow the user to select from
							choices: rolesArr,
						},
					])
					.then((selectedRole) => {
						const role = selectedRole.role;
						newEmployee.push(role);
						console.log(newEmployee);

						const addNewEmployee = `INSERT INTO employee(first_name, last_name, role_id ) VALUE (?,?,?)`;

						db.query(addNewEmployee, newEmployee, (err) => {
							if (err) throw err;
							console.log("Thank you for adding new employee");
							console.log("next");
							manage();
						});
					});
			});
		});
};

const updateRole = () => {
	db.query(`SELECT * FROM employee`, (err, results) => {
		if (err) throw err;
		const employees = results.map(({ employee_id, first_name, last_name }) => ({
			name: first_name + " " + last_name,
			value: employee_id,
		}));
		inquirer
			.prompt([
				{
					name: "employeeToUpdate",
					type: "list",
					message: "Which employee's role do you want to update?",
					choices: employees,
				},
			])
			.then((answer) => {
				const selectedEmployee = answer.employeeToUpdate;

				db.query(`SELECT * FROM employee_role`, (err, results) => {
					console.log(results);
					if (err) throw err;
					const roles = results.map(({ role_id, job_title }) => ({
						name: job_title,
						value: role_id,
					}));
					inquirer
						.prompt([
							{
								name: "newRole",
								type: "list",
								message: "What is the employee's new role?",
								choices: roles,
							},
						])
						.then((answer) => {
							const newRole = answer.newRole;
							db.query(`UPDATE employee SET ? WHERE employee_id = ?`, [
								{
									role_id: newRole,
								},
								selectedEmployee,
							]);
							console.log("Updated selected employee's role");
							console.log("Next");
							manage();
						});
				});
			});
	});
};

manage();

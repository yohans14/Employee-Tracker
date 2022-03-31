INSERT INTO department (department_name)
VALUE
('HR'),
('IT'),
('Marketing'),
('Engineering'),
('Finance'),
('Management');

INSERT INTO employee_role (job_title, salary, department_id)
VALUE 
('Recruiter',89000, 1),
('Sefety officer',75000, 1),
('IT Technician',89000, 2),
('IT Support',49000,2 ),
('Content marketing specialist',500000, 3),
('Digital marketing manager',90000, 3),
('System Engineering',80000, 4),
('Network Engineering', 84000, 4),
('Software Engineer', 100000, 4),
('Accountant',70000, 5),
('Account Manager',105000, 5),
('Manager',200000, 6);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUE
("Yovonnda", "Magrannel",1,1),
("Mindy", "Crissil",2,1),
('Keriann', 'Alloisi',3,1),
('Alaster', 'Scutchin',4,1),
('North', 'Rising',5,1),
('Elladine', 'Rising',6,1),
('Yegele', 'Negussie',11,NULL);


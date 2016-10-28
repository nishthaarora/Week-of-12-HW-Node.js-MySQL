// requiring node packages
var mysql = require('mysql');
var inquirer = require('inquirer');
require('console.table');

// making server connection
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '',
	database: 'bamazon'
});

connection.connect(function(err) {
	if (err) throw err;
});


// getting all the objects from the departments table in a variable res
function getResponseData() {
	connection.query('SELECT * FROM departments', function(err, res) {
		if (err) throw err;
		executiveInputs(res);
	})
}


/* prominting the managers with different views. In this manager can view department wise sales and their profits according to the
 purchases made by the customer in the BamazonCustomer.js file. In this function totalProfits column is created on the fly
 manager can also add new departments into the table by select "enter new dept option" to track their sales.
*/
function executiveInputs(res) {
	inquirer.prompt({
		name: 'deptSales',
		type: 'list',
		message: 'What do you want to do',
		choices: ['View Product Sales by Department', 'Create New Department']
	}).then(function(answer) {
		switch (answer.deptSales) {
			case 'View Product Sales by Department':
				connection.query('SELECT DepartmentID, DepartmentName, OverHeadCosts, TotalSales, (TotalSales - OverHeadCosts) AS TotalProfit FROM departments', function (err, res) {
					if(err)throw err;
					console.table(res);
					connection.end();
				})
				break;


			case 'Create New Department':
				inquirer.prompt([{
					name: 'newDeptName',
					type: 'input',
					message: 'Enter new department name',
				}, {
					name: 'ohCost',
					type: 'input',
					message: 'Enter Overhead Cost',
					validate: function(answer) {
						if(answer > 0 ) {
							return true;
						}
					}
				}]).then(function(answer) {
						var deptName = answer.newDeptName.toUpperCase();
						var query = 'INSERT INTO departments SET DepartmentName = ?, OverHeadCosts = ?'
						connection.query(query, [deptName, answer.ohCost], function(err, res) {
							if(err)throw err;
							console.log('department added');
						})
						connection.end();
			})

				break;
		}
	})
}
getResponseData();
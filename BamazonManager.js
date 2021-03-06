// requiring node packages
var mysql = require('mysql');
var inquirer = require('inquirer');
var Promise = require('bluebird');
require('console.table');

// making connections
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


/* this is the function to display the table everytime manager updated anything in the table. This function is called at all the places
where there is an addition or a change to the inventory. Like updating itmID, Price, Department Name, product Name, stock quantity.
*/

function displayData() {

	console.log('Here is the udated data');
	console.log('----------------------------------------------------------');
	connection.query('SELECT * FROM products', function(err, res) {
		if (err) throw err;
		console.table(res);
	})

}

/* this function is displaying the itemID's existing in the products table so that if a manager wants to update anything this will show itemID's
	as a choice and not an inout field.
*/
function validateItemId() {
	return new Promise(function(resolve, reject) {
		var choice = [];
		connection.query('SELECT * FROM products', function(err, res) {
			if (err) throw err;
			res.forEach(function(ele) {
				choice.push(ele.ItemID);
			})
			resolve(choice);

		})
	});
}


/* this function runs when user selects Add to Inventory in displayMenuOptions() function. This gives a manager an ability to change an itemID
 for the existing items. */
function updateItemId() {
	validateItemId().then(function(choice) {
		inquirer.prompt([{
			name: 'oldId',
			type: 'list',
			message: 'Enter a old ItemID',
			choices: choice
		}, {
			name: 'newId',
			type: 'input',
			message: 'Enter a new ItemID'
		}]).then(function(answer) {
			var query = 'UPDATE products SET ItemID = ? WHERE ItemID = ?';
			connection.query(query, [answer.newId, answer.oldId], function(err, res) {
				if (err) throw err;
				console.log('New Id has been updated');
				console.log('----------------------------------------------------------');
				displayData();
			});
		});
	});
}


/* this function runs when user selects Add to Inventory in displayMenuOptions() function. This gives a manager an ability to change a product name
 for the existing products. */
function updateProductName() {

	validateItemId().then(function(choice) {

		inquirer.prompt([{
			name: 'ItemID',
			type: 'list',
			message: 'Enter an Item Id which you wish to update',
			choices: choice
		}, {
			name: 'productName',
			type: 'input',
			message: 'Enter a new Product Name'
		}]).then(function(answer) {
			var product = answer.productName.toUpperCase();
			var query = 'UPDATE products SET productName = ? WHERE ItemID = ?';
			connection.query(query, [product, answer.ItemID], function(err, res) {
				if (err) throw err;
				console.log('New Product Name has been updated');
				console.log('----------------------------------------------------------');
				displayData()
			})
		})
	})
}


/* this function runs when user selects Add to Inventory in displayMenuOptions() function. This gives a manager an ability to change a department
name for the existing departments. If the  department doesnot exist, only executives has the ability to add new departments. Manager can only
change existing departments */

function updateDepartmentName() {
	var deptChoice = [];
	connection.query('SELECT * FROM departments', function(err, res) {
		if (err) throw err;
		res.forEach(function(ele) {
			deptChoice.push(ele.DepartmentName);
		})
	})

	validateItemId().then(function(choice) {
		console.log('Note: If the department you are looking for doesnot exist, kindly contact your supervisor to get the department added');
		inquirer.prompt([{
			name: 'ItemID',
			type: 'list',
			message: 'Enter an Item Id which you wish to update',
			choices: choice
		}, {
			name: 'DepartmentName',
			type: 'list',
			message: 'which department would you like to add this product in',
			choices: deptChoice
		}]).then(function(answer) {

			var query = 'UPDATE products SET DepartmentName = ? WHERE ItemID = ?';
			connection.query(query, [answer.DepartmentName, answer.ItemID], function(err, res) {
				if (err) throw err;
				console.log('New Department Name has been updated');
				console.log('----------------------------------------------------------');
				displayData()
			})
		})
	})
}


/* this function runs when user selects Add to Inventory in displayMenuOptions() function. This gives a manager an ability to change a price
 for the existing product. */
function updatePrice() {

	validateItemId().then(function(choice) {
		inquirer.prompt([{
			name: 'ItemID',
			type: 'list',
			message: 'Enter an Item Id which you wish to update',
			choices: choice
		}, {
			name: 'Price',
			type: 'input',
			message: 'Enter a new Price',
			validate: function(answer) {
				if (answer > 0) {
					return true;
				}
			}
		}]).then(function(answer) {

			var query = 'UPDATE products SET Price = ? WHERE ItemID = ?';
			connection.query(query, [answer.Price, answer.ItemID], function(err, res) {
				if (err) throw err;
				console.log('New Price has been updated');
				console.log('----------------------------------------------------------');
				displayData()
			})
		})
	})
}


/* this function runs when user selects Add to Inventory in displayMenuOptions() function. This gives a manager an ability to change an stock
quantity for the existing product. */
function updateStockQuantity() {
	validateItemId().then(function(choice) {
		inquirer.prompt([{
			name: 'ItemID',
			type: 'list',
			message: 'Enter an Item Id which you wish to update',
			choices: choice
		}, {
			name: 'StockQuantity',
			type: 'input',
			message: 'Enter a new StockQuantity',
			validate: function(answer) {
				if (answer > 0) {
					return true;
				}
			}
		}]).then(function(answer) {
			var query = 'UPDATE products SET StockQuantity = ? WHERE ItemID = ?';
			connection.query(query, [answer.StockQuantity, answer.ItemID], function(err, res) {
				if (err) throw err;
				console.log('New StockQuantity has been updated');
				console.log('----------------------------------------------------------');
				displayData()
			})
		})
	})
}


/* this is the main function which dislays all the options that the manager can do like view products for sale, low inventory, add to inventory,
or add new product */
function displayMenuOptions() {

	inquirer.prompt({
		name: 'decision',
		type: 'list',
		message: 'What would you like to do?',
		choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
	}).then(function(answer) {

		switch (answer.decision) {

			case 'View Products for Sale':
				var query = 'SELECT ItemID, ProductName, Price, StockQuantity FROM products'
				connection.query(query, function(err, res) {
					console.table(res);
				})
				connection.end();
				break;

			case "View Low Inventory":

				var query = 'SELECT ItemID, ProductName, Price, StockQuantity, SUM(StockQuantity) as TOTAL FROM products  GROUP BY ProductName HAVING TOTAL < 5'
				connection.query(query, function(err, res) {
					if (err) throw err;
					console.log('--------------------------------------------------------------------')
					console.table(res);
					console.log('--------------------------------------------------------------------')
				});
				connection.end();
				break;


			case "Add to Inventory":

				new Promise(function(resolve, reject) {
					connection.query('SELECT * FROM products', function(err, res) {
						if (err) throw err;
						console.table(res);
						resolve();
					})
				}).then(function() {

					inquirer.prompt([{
						name: 'update',
						type: 'list',
						message: 'What Would you like to update?',
						choices: ['ItemID', 'ProductName', 'DepartmentName', 'Price', 'StockQuantity']
					}]).then(function(answer) {

						switch (answer.update) {
							case 'ItemID':
								updateItemId();
								break;

							case 'ProductName':
								updateProductName();
								break;

							case 'DepartmentName':
								updateDepartmentName();
								break;

							case 'Price':
								updatePrice();
								break;

							case 'StockQuantity':
								updateStockQuantity();
								break;

							default:
								text = "Please select correct answer"
						}
					});
				})

				break;

			case "Add New Product":
				inquirer.prompt([{
					name: 'itemID',
					type: 'input',
					message: 'Enter an ID for the item'
				}, {
					name: 'productName',
					type: 'input',
					message: 'Enter product name'
				}, {
					name: 'departmentName',
					type: 'input',
					message: 'Enter department name'
				}, {
					name: 'price',
					type: 'input',
					message: 'Price per unit'
				}, {
					name: 'stockQuantity',
					type: 'input',
					message: 'Stock in inventory'
				}]).then(function(answer) {
					var query = 'INSERT INTO products (`ItemID`, `ProductName`, `DepartmentName`, `Price`, `StockQuantity`) VALUES (?,?,?,?,?)';
					connection.query(query, [answer.itemID, answer.productName, answer.departmentName, answer.price, answer.stockQuantity], function(err) {
						if (err) throw err;
						console.log('Inventory Updated');
					})
				})
				break;

			default:
				text = "Please select correct answer"
		}
	})

}


displayMenuOptions();
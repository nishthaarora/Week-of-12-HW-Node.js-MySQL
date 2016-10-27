#Week of 12 HW: Node.js & MySQL

## Overview

This is an app like Amazon storefront with mySQL. The app takes an order from the customer updated the quantity of the stock for the manager
abd tracks the sales and profit for the executives and provide a summary of the departments in the store.

### Usage

This app has 2 usages

1. *Customer*
	* customer can **order products**. If the product is avalable in the store then the order will be placed else it will give a message of **"insufficient quantity"**

2. *Managers*
 	* **view products for sale**.
 		They can **view all the product** list which are available **for sale**.

 	* **view low inventory**.
 		They can **view the inventory which is less than 5 items** so that they can place an order.

 	* **Add to inventory**.
 		They can **edit the inventory details** like item ID, product name, department, price, and the quantity of the product.

 	* **Add new products**.
 		They can **add new products to the current inventory**. They would have to fill out all the details like product ID, its name, department etc.

3. *Executives*

	* **view product sale by department**.
		Including the total sales of the department, they can also view profits which are calculated on the fly  when the customer places an order.

	* **Add new department**.
		They can add new departments to start monitoring the profits of that department

### Link for the app
[app screenshots](https://github.com/nishthaarora/Week-of-12-HW-Node.js-MySQL/tree/master/appScreenshots)
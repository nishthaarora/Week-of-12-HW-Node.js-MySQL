CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	ItemID VARCHAR (50) PRIMARY KEY NOT NULL,
	ProductName VARCHAR (50),
	DepartmentName VARCHAR (50),
	Price DECIMAL (65, 2),
	StockQuantity INT (50)

);


CREATE TABLE departments (
	DepartmentID INT(50) PRIMARY KEY AUTO_INCREMENT NOT NULL,
	DepartmentName VARCHAR(50),
	OverHeadCosts INT(50),
	TotalSales INT(50)
)


INSERT INTO products (ItemID, ProductName, DepartmentName, Price, StockQuantity)
VALUES
('itm1', 'MOBILE', 'TECHNOLOGY', 699.99, 10),
('itm2', 'LAPTOP', 'TECHNOLOGY', 1445.65, 5),
('itm3', 'TOYS', 'GAME', 17.98, 100),
('itm4', 'BREAD', 'GROCERY', 18.24, 50),
('itm5', 'CLOTHES', 'GARMENTS', 15.50, 150),
('itm6', 'FRUITS', 'GROCERY', 4.65, 50),
('itm7', 'DECOR', 'HOME', 35.97, 30);


INSERT INTO departments (DepartmentName, OverHeadCosts)
VALUES ('TECHNOLOGY', 500), ('GAME', 400), ('GROCERY', 1000), ('GARMENTS', 500), ('HOME', 600) ;


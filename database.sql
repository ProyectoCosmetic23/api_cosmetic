/* Create the roles table */
CREATE TABLE roles (
	id_role INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	name_role VARCHAR (100) NOT NULL UNIQUE,
	state_role CHARACTER VARYING(15) NOT NULL,
	modules_role VARCHAR (150) NOT NULL
);

/* Create the providers table */
CREATE TABLE providers (
	id_provider INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	nit_cedula VARCHAR(10) UNIQUE,
	name_provider VARCHAR (100) NOT NULL UNIQUE,
	email_provider VARCHAR (100) NOT NULL UNIQUE,
	address_provider VARCHAR (100) NOT NULL UNIQUE,
	phone_provider VARCHAR (25) NOT NULL UNIQUE,
	state_provider CHARACTER VARYING(15),
	observation_provider VARCHAR (100),
	name_contact VARCHAR (100) NOT NULL UNIQUE,
	creation_date_provider DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE employees (
	id_employee INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	id_card_employee VARCHAR(10) UNIQUE,
	name_employee VARCHAR(80) NOT NULL,
	email VARCHAR(80) NOT NULL,
	address VARCHAR(80) NOT NULL,
	phone VARCHAR (80) NOT NULL,
	state_employee CHARACTER VARYING(15),
	observation VARCHAR(100),
    creation_date_employee TIMESTAMP
);

/* Create the clients table */
CREATE TABLE clients (
	id_client  INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	nit_or_id_client VARCHAR(10) UNIQUE,
	name_client VARCHAR (100) NOT NULL,
	last_name_client VARCHAR (100) NOT NULL,
	email_client VARCHAR (100) NOT NULL,
	phone_client VARCHAR (20) NOT NULL,
	address_client VARCHAR (100) NOT NULL,
	state_client CHARACTER VARYING(15) 
);

/* Create the categories table */
CREATE TABLE product_categories (
	id_category INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	name_category VARCHAR(100) UNIQUE,
	state_category BOOLEAN NOT NULL DEFAULT TRUE,
	observation_category VARCHAR (100),
	creation_date_category TIMESTAMP
);

/* Create the products table */
CREATE TABLE products (
	id_product INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	id_category INT NOT NULL,
	name_product VARCHAR(80) NOT NULL,
	quantity INT NOT NULL,
	max_stock INT NOT NULL,
	min_stock INT NOT NULL,
	cost_price NUMERIC NOT NULL,
	selling_price NUMERIC NOT NULL,
	profit NUMERIC NOT NULL,
	creation_date_product TIMESTAMP,
	state_product CHARACTER VARYING(15),
	observation VARCHAR(100)
);

/* Create the defective_products table */
CREATE TABLE defective_products (
    id_defective_product INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_product INT NOT NULL,
    return_reason VARCHAR(100),
    return_date TIMESTAMP,
	return_quantity INT NOT NULL,
	return_value NUMERIC NOT NULL
);

/* Create the users table */
CREATE TABLE users (
	id_user INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	id_card_employee VARCHAR(10),
	name_role VARCHAR (100) NOT NULL,
	creation_date_user TIMESTAMP,
	username VARCHAR (100) NOT NULL UNIQUE,
	email VARCHAR (100) NOT NULL,
	password VARCHAR (100) NOT NULL,
	state_user CHARACTER VARYING(15),
	observation_user VARCHAR (100)
);

/* Create the purchases table */
CREATE TABLE purchases (
	id_purchase INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	id_provider INT NOT NULL,
	invoice_number VARCHAR(20),
	purchase_date TIMESTAMP,
	record_date_purchase TIMESTAMP,
	total_purchase NUMERIC,
	state_purchase BOOLEAN NOT NULL DEFAULT TRUE,
	observation_purchase VARCHAR (100)
);

/* Create the purchase detail table */
CREATE TABLE purchase_detail (
	id_purchase_detail  INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	id_purchase INT NOT NULL,
	id_product INT NOT NULL,
	id_category  VARCHAR(100),
	product_quantity INT NOT NULL,
	cost_price NUMERIC,
	selling_price NUMERIC,
	vat NUMERIC
);

/* Create the orders table */
CREATE TABLE orders (
	id_order INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	id_client INT NOT NULL,
	id_employee INT NOT NULL,
	order_number INT NOT NULL,
	order_date TIMESTAMP NOT NULL,
	payment_type VARCHAR (100) NOT NULL,
	order_state CHARACTER VARYING(15),
	delivery_state CHARACTER VARYING(15),
	payment_state CHARACTER VARYING(15),
	total_order NUMERIC
);

/* Create the order detail table */
CREATE TABLE order_detail (
	id_order_detail INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	id_order INT NOT NULL,
	id_product INT NOT NULL,
	product_quantity INT NOT NULL,
	product_price NUMERIC NOT NULL
);

/* Create the sales table */
CREATE TABLE sales (
	id_sale INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	id_order INT NOT NULL,
	id_client INT NOT NULL,
	id_employee INT NOT NULL,
	invoice_number INT NOT NULL,
	order_date TIMESTAMP NOT NULL,
	delivery_date TIMESTAMP,
	sale_state CHARACTER VARYING(15),
	payment_state CHARACTER VARYING(15),
	payment_type VARCHAR (100) NOT NULL,
	total_sale NUMERIC NOT NULL,
	observation_return VARCHAR (250) NULL
);

/* Create the sale detail table */
CREATE TABLE sale_detail (
	id_sale_detail INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	id_sale INT NOT NULL,
	id_product INT NOT NULL,
	quantity INT NOT NULL,
	product_price NUMERIC
);

/* Create the commissions table */
CREATE TABLE commissions (
	id_commission INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	id_employee INT NOT NULL,
	total_commission NUMERIC NOT NULL,
	id_commission_detail INT NOT NULL,
	total_sales INT NOT NULL
);

/* Create the commission detail table */
CREATE TABLE commission_detail (
	id_commission_detail INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	month_commission DATE NOT NULL DEFAULT CURRENT_DATE UNIQUE,
	commission_percentage INT NOT NULL
);

/* Create the payments table */
CREATE TABLE payments (
	id_payment INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	id_sale INT NULL,
	id_order INT NULL,
	id_client INT NOT NULL,
	payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
	total_payment NUMERIC NOT NULL,
	total_remaining NUMERIC NOT NULL
);

/* Create the returns table */
CREATE TABLE returns (
	id_return  INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	id_sale INT NOT NULL,
	id_product  INT NOT NULL,
	return_date TIMESTAMP NOT NULL,
	return_quantity INT NOT NULL,
	return_value NUMERIC NOT NULL,
	return_reason VARCHAR (250) NOT NULL
);

/* Foreign Keys for the 'returns' Table */
ALTER TABLE returns
ADD CONSTRAINT fk_returnsSale
FOREIGN KEY (id_sale) REFERENCES sales(id_sale);

ALTER TABLE returns
ADD CONSTRAINT fk_returnsProduct
FOREIGN KEY (id_product) REFERENCES products(id_product);

/* Foreign Keys for the 'sales' Table */
ALTER TABLE sales
ADD CONSTRAINT fk_salesOrder
FOREIGN KEY(id_order) 
REFERENCES orders(id_order);

ALTER TABLE sales
ADD CONSTRAINT fk_salesClient 
FOREIGN KEY (id_client) 
REFERENCES clients(id_client);

ALTER TABLE sales
ADD CONSTRAINT fk_salesEmployee 
FOREIGN KEY (id_employee) 
REFERENCES employees(id_employee);

/* Foreign Keys for the 'order_detail' Table */
ALTER TABLE order_detail
ADD CONSTRAINT fk_orderDetailOrder FOREIGN KEY
(id_order) REFERENCES
orders(id_order);

ALTER TABLE order_detail
ADD CONSTRAINT fk_orderDetailProduct
FOREIGN KEY (id_product) 
REFERENCES products(id_product);

/* Foreign Keys for the 'payments' Table */
ALTER TABLE payments
ADD CONSTRAINT fk_paymentsSale
FOREIGN KEY (id_sale) 
REFERENCES sales(id_sale);

ALTER TABLE payments
ADD CONSTRAINT fk_paymentsOrder
FOREIGN KEY (id_order) 
REFERENCES orders(id_order);

ALTER TABLE payments
ADD CONSTRAINT fk_paymentsClient
FOREIGN KEY (id_client) 
REFERENCES clients(id_client);

/* Foreign Keys for the 'commissions' Table */
ALTER TABLE commissions
ADD CONSTRAINT fk_commissionsEmployee
FOREIGN KEY (id_employee)
REFERENCES employees(id_employee);

ALTER TABLE commissions
ADD CONSTRAINT fk_commissionsCommissionDetail
FOREIGN KEY (id_commission_detail)
REFERENCES commission_detail(id_commission_detail);

/* Foreign Keys for the 'purchases' Table */
ALTER TABLE purchases 
ADD CONSTRAINT fk_purchasesProvider
FOREIGN KEY (id_provider) 
REFERENCES providers(id_provider);

/* Foreign Keys for the 'purchase_detail' Table */
ALTER TABLE purchase_detail
ADD CONSTRAINT fk_purchaseDetailPurchase 
FOREIGN KEY (id_purchase) 
REFERENCES purchases(id_purchase);

ALTER TABLE purchase_detail
ADD CONSTRAINT fk_purchaseDetailProduct
FOREIGN KEY (id_product) 
REFERENCES products(id_product);

/* Foreign Keys for the 'users' Table */
ALTER TABLE users
ADD CONSTRAINT fk_usersRole
FOREIGN KEY (name_role)
REFERENCES roles(name_role);

-- ALTER TABLE users
-- ADD CONSTRAINT fk_usersEmployee
-- FOREIGN KEY (id_card_employee) 
-- REFERENCES employees(id_card_employee);

/* Foreign Keys for the 'products' Table */
ALTER TABLE products
ADD CONSTRAINT fk_productsCategory
FOREIGN KEY (id_category) 
REFERENCES product_categories(id_category);

/* Foreign Keys for the defective_products Table */
ALTER TABLE defective_products
ADD CONSTRAINT fk_defectiveProductsProduct
FOREIGN KEY (id_product) 
REFERENCES products(id_product);



-- Insert into the 'commission_detail' Table
INSERT INTO commission_detail (month_commission, commission_percentage)
VALUES ('2023-11-01', 10),
       ('2023-04-01', 5),
       ('2023-05-01', 8);

-- Insert into the 'roles' Table
INSERT INTO roles (name_role, state_role, modules_role)
VALUES ('Administrator', 'Activo', 'Module A, Module B, Module C'),
       ('Manager', 'Activo', 'Module B, Module C'),
       ('Employee', 'Activo', 'Module C');

-- Insert into the 'providers' Table
INSERT INTO providers (nit_cedula, name_provider, email_provider, address_provider, phone_provider, state_provider, observation_provider, name_contact, creation_date_provider)
VALUES ('1234567890', 'Provider 1', 'provider1@email.com', 'Address 1', '1234567890', 'Activo', 'Observation 1', 'Contact 1', current_timestamp),
       ('9876543210', 'Provider 2', 'provider2@email.com', 'Address 2', '9876543210', 'Activo', 'Observation 2', 'Contact 2', current_timestamp),
       ('5555555555', 'Provider 3', 'provider3@email.com', 'Address 3', '5555555555', 'Inactivo', 'Observation 3', 'Contact 3', current_timestamp);

-- Insert into the 'employees' Table
INSERT INTO employees (id_card_employee, name_employee, email, address, phone, state_employee, observation,creation_date_employee)
VALUES ('1111111111', 'Employee 1', 'employee1@email.com', 'Address 1', '1111111111', 'Active', 'Observation 1',current_timestamp),
       ('2222222222', 'Employee 2', 'employee2@email.com', 'Address 2', '2222222222', 'Active', 'Observation 2',current_timestamp),
       ('3333333333', 'Employee 3', 'employee3@email.com', 'Address 3', '3333333333', 'Inactive', 'Observation 3',current_timestamp);

-- Insert into the 'clients' Table
INSERT INTO clients (nit_or_id_client, name_client, last_name_client, email_client, phone_client, address_client, state_client)
VALUES ('1000000000', 'Client 1', 'Last Name 1', 'client1@email.com', '1000000000', 'Address 1', 'Active'),
       ('2000000000', 'Client 2', 'Last Name 2', 'client2@email.com', '2000000000', 'Address 2', 'Active'),
       ('3000000000', 'Client 3', 'Last Name 3', 'client3@email.com', '3000000000', 'Address 3', 'Inactive');

-- Insert into the 'product_categories' Table
INSERT INTO product_categories (name_category, state_category, observation_category, creation_date_category)
VALUES ('Category 1', 'Active', 'Observation 1', current_timestamp),
       ('Category 2', 'Active', 'Observation 2', current_timestamp),
       ('Category 3', 'Inactive', 'Observation 3', current_timestamp);

-- Insert into the 'products' Table
INSERT INTO products (id_category, name_product, quantity, max_stock, min_stock, cost_price, selling_price, profit, creation_date_product, state_product, observation)
VALUES (1, 'Product 1', 100, 200, 50, 10.00, 15.00, 5.00, current_timestamp, 'Active', 'Observation 1'),
       (2, 'Product 2', 150, 250, 75, 12.00, 20.00, 8.00, current_timestamp, 'Active', 'Observation 2'),
       (3, 'Product 3', 75, 100, 25, 8.00, 14.00, 6.00, current_timestamp, 'Inactive', 'Observation 3');

-- Insert into the 'users' Table
INSERT INTO users (name_role, id_card_employee, creation_date_user, username, email, password, state_user, observation_user)
VALUES ('Administrator', '1111111111', current_timestamp, 'admin', 'employee1@email.com', 'password_admin', 'Active', 'Observation 1'),
       ('Employee', '2222222222', current_timestamp, 'manager', 'employee2@email.com', 'password_manager', 'Active', 'Observation 2'),
       ('Manager', '3333333333', current_timestamp, 'employee', 'employee3@email.com', 'password_employee', 'Inactive', 'Observation 3');

-- Insert into the 'purchases' Table
INSERT INTO purchases (id_provider, invoice_number, purchase_date, record_date_purchase, total_purchase, state_purchase, purchase_photo, observation_purchase)
VALUES (1, '0001', current_timestamp, current_timestamp, 500.00, 'Completed', NULL, 'Observation 1'),
       (2, '0002', current_timestamp, current_timestamp, 750.00, 'Pending', NULL, 'Observation 2'),
       (3, '0003', current_timestamp, current_timestamp, 400.00, 'Completed', NULL, 'Observation 3');

-- Insert into the 'purchase_detail' Table
INSERT INTO purchase_detail (id_purchase, id_product, product_category, product_quantity, cost_price, selling_price, sub_total)
VALUES (1, 1, 'Category 1', 50, 9.00, 14.00, 700.00),
       (2, 2, 'Category 2', 75, 11.00, 18.00, 1350.00),
       (3, 3, 'Category 3', 40, 7.00, 12.00, 480.00);

-- Insert into the 'orders' Table
INSERT INTO orders (id_client, id_employee, order_number, order_date, payment_type, order_state, delivery_state, payment_state, total_order)
<<<<<<< HEAD:database/database.sql
VALUES (1, 1, 1001, current_timestamp, 'Cash', 'Active', 'In Progress', 'To be paid', 1500.00),
       (2, 2, 1002, current_timestamp, 'Credit Card', 'Active', 'To be delivered', 'To be paid', 1200.00),
       (3, 3, 1003, current_timestamp, 'Check', 'Active', 'Delivered', 'To be paid', 1800.00);
=======
VALUES (1, 1, 1001, current_timestamp, 'Contado', 'Activo', 'En proceso', 'Por pagar', 1500.00),
       (2, 2, 1002, current_timestamp, 'Credito', 'Activo', 'Por entregar', 'Por pagar', 1200.00),
       (3, 3, 1003, current_timestamp, 'Contado', 'Activo', 'Por entregar', 'Por pagar', 1800.00);
>>>>>>> b3d05fee0041b74606ac5a54be4086694ad19f7b:database.sql

-- Insert into the 'order_detail' Table
INSERT INTO order_detail (id_order, id_product, product_quantity, product_price)
VALUES (1, 1, 30, 14.00),
       (2, 2, 25, 18.00),
       (3, 3, 20, 12.00);

-- Insert into the 'sales' Table
INSERT INTO sales (id_order, id_client, id_employee, invoice_number, order_date, sale_state, payment_state, payment_type, total_sale)
<<<<<<< HEAD:database/database.sql
VALUES (1, 1, 1, 5001, current_timestamp, 'Active', 'To be paid', 'Cash', 420.00),
       (2, 2, 2, 5002, current_timestamp, 'Active', 'To be paid', 'Credit Card', 675.00),
       (3, 3, 3, 5003, current_timestamp, 'Active', 'Paid', 'Check', 360.00);
=======
VALUES (1, 1, 1, 5001, current_timestamp, 'Activa', 'Por pagar', 'Contado', 420.00),
       (2, 2, 2, 5002, current_timestamp, 'Activa', 'Por pagar', 'Crédito', 675.00),
       (3, 3, 3, 5003, current_timestamp, 'Activa', 'Pagado', 'Contado', 360.00);
>>>>>>> b3d05fee0041b74606ac5a54be4086694ad19f7b:database.sql

-- Insert into the 'sale_detail' Table
INSERT INTO sale_detail (id_sale, id_product, quantity, product_price)
VALUES (1, 1, 15, 14.00),
       (2, 2, 20, 18.00),
       (3, 3, 12, 12.00);

-- Insert into the 'commissions' Table
<<<<<<< HEAD:database/database.sql

=======
INSERT INTO commissions(id_employee, total_commission, id_commission_detail, total_sales)
VALUES(1, 42.00, 1, 1500),
	  ( 2, 81.00,2, 2500),
	  (3, 28.00, 3, 3500);
>>>>>>> b3d05fee0041b74606ac5a54be4086694ad19f7b:database.sql

-- Insert into the 'payments' Table
INSERT INTO payments (id_sale, id_order,id_client, payment_date, total_payment, total_remaining)
VALUES (1,null, 1, current_timestamp, 420.00, 0.00),
       (null,1, 2, current_timestamp, 1500, 0.00),
       (3,null, 3, current_timestamp, 360.00, 0.00);

-- Insert into the 'returns' Table
INSERT INTO returns (id_sale, id_product, return_date, return_quantity, return_value, return_reason)
VALUES (1, 1, current_timestamp, 5, 70.00, 'Defecto de fábrica'),
       (2, 2, current_timestamp, 4, 72.00, 'Defecto de fábrica'),
       (3, 3, current_timestamp, 6, 72.00, 'Defecto de fábrica');
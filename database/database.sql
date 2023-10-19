/* Se crea la tabla Roles */
CREATE TABLE roles (
	id_Rol INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	nombre_Rol VARCHAR (100) NOT NULL UNIQUE,
	estado_Rol CHARACTER VARYING(15) NOT NULL,
	modulos_Rol VARCHAR (150) NOT NULL
);

/* Se crea la tabla proveedores */
CREATE TABLE proveedores(
	id_Proveedor INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	nit_Cedula VARCHAR(10) UNIQUE, 
	nombre_Proveedor VARCHAR (100) NOT NULL UNIQUE,
	correo_Proveedor VARCHAR (100) NOT NULL UNIQUE,
	direccion_Proveedor VARCHAR (100) NOT NULL UNIQUE,
	telefono_Proveedor VARCHAR (25) NOT NULL UNIQUE,
	estado_Proveedor  CHARACTER VARYING(15),
	observacion_Proveedor VARCHAR (100),
	nombre_Contacto VARCHAR (100) NOT NULL UNIQUE,
	fecha_Creacion_Proveedor TIMESTAMP
);

CREATE TABLE empleados (
	id_Empleado INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	cedula_Empleado VARCHAR(10) UNIQUE,
	nombre_Empleado VARCHAR(80) NOT NULL,
	correo VARCHAR(80) NOT NULL,
	direccion VARCHAR(80) NOT NULL,
	telefono VARCHAR (80) NOT NULL,
	estado_Empleado CHARACTER VARYING(15),	
	observacion VARCHAR(100)
);

/* Se crea la tabla clientes */
CREATE TABLE clientes (
	id_Cliente  INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	nit_O_Cedula_Cliente VARCHAR(10) UNIQUE,
	nombre_Cliente VARCHAR (100) NOT NULL,
	apellido_Cliente VARCHAR (100),
	correo_Cliente VARCHAR (100) NOT NULL ,
	telefono_Cliente VARCHAR (20) NOT NULL,
	direccion_Cliente VARCHAR (100)NOT NULL,
	estado_Cliente CHARACTER VARYING(15) NOT NULL 
);

/* Se crea la tabla categorias */

CREATE TABLE categorias_Productos(
	id_Categoria INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	nombre_Categoria VARCHAR(100) UNIQUE ,
	estado_Categoria CHARACTER VARYING(15),
	observacion_Categoria VARCHAR (100),
	fecha_Creacion_Categoria TIMESTAMP
);

/* Se crea la tabla productos */

CREATE TABLE productos (
	id_Producto INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	id_Categoria INT NOT NULL,
	nombre_Producto VARCHAR(80) NOT NULL,
	cantidad INT NOT NULL,
	stock_Maximo INT NOT NULL,
	stock_Minimo INT NOT NULL,
	precio_Costo NUMERIC NOT NULL,
	precio_Venta NUMERIC NOT NULL,
	ganancia NUMERIC NOT NULL,
	fecha_Creacion_Producto TIMESTAMP NOT NULL,
	estado_Producto CHARACTER VARYING(15),
	observacion VARCHAR(100)
);

/* Se crea la tabla usuarios */

CREATE TABLE usuarios(
	id_Usuario INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	id_Rol INT NOT NULL,
	id_Empleado INT NOT NULL,
	fecha_Creacion_Usuario TIMESTAMP,
	nombre_Usuario VARCHAR (100) NOT NULL UNIQUE,
	correo_Usuario VARCHAR (100) NOT NULL,
	contrasena_Usuario VARCHAR (100) NOT NULL,
	estado_Usuario CHARACTER VARYING(15),
	observacion_Usuario VARCHAR (100)
);

/* Se crea la tabla compras */

CREATE TABLE compras(
	id_Compra INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	id_Proveedor INT NOT NULL,
	numero_Factura VARCHAR(4),
	fecha_Compra TIMESTAMP,
	fecha_RegistroCompra TIMESTAMP,
	total_Compra NUMERIC,
	estado_Compra CHARACTER VARYING(15),
	foto_Compra BYTEA,
	observacion_Compra VARCHAR (100)
);

/* Se crea la tabla detalle_Compra */

CREATE TABLE detalle_Compra (
	id_Detalle_Compra  INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	id_Compra INT NOT NULL,
	id_Producto INT NOT NULL,
	categoria_Producto  VARCHAR(100),
	cantidad_Producto INT NOT NULL,
	precio_Costo NUMERIC,
	precio_Venta NUMERIC,
	subTotal NUMERIC
);

/* Se crea la tabla Pedido */

CREATE TABLE pedidos (
	id_Pedido INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	id_Cliente INT NOT NULL,
	id_Empleado INT NOT NULL,
	numero_Pedido INT NOT NULL,
	fecha_Pedido TIMESTAMP NOT NULL,
	fecha_Entrega TIMESTAMP NOT NULL,
	tipo_Pago VARCHAR (100) NOT NULL,
	estado_Pedido CHARACTER VARYING(15),
	estado_Entrega CHARACTER VARYING(15),
	estado_Pago CHARACTER VARYING(15),
	total_Pedido NUMERIC
);

/* Se crea la tabla detalle_Pedido */

CREATE TABLE detalle_Pedido (
	id_Detalle_Pedido INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	id_Pedido INT NOT NULL,
	id_Producto INT NOT NULL,
	cantidad_Producto INT NOT NULL,
	precio_Producto NUMERIC NOT NULL
);

/* Se crea la tabla ventas */

CREATE TABLE ventas (
	id_Venta INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	id_Pedido INT NOT NULL,
	id_Cliente INT NOT NULL,
	id_Empleado INT NOT NULL,
	numero_Factura INT NOT NULL,
	fecha_Venta TIMESTAMP NOT NULL,
	estado_Venta CHARACTER VARYING(15),
	estado_Pago CHARACTER VARYING(15),
	tipo_Pago VARCHAR (100) NOT NULL,
	total_Venta NUMERIC NOT NULL
);

/* Se crea la tabla detalle_Venta */

CREATE TABLE detalle_Venta (
	id_Detalle_Venta INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	id_Venta INT NOT NULL,
	id_Producto INT NOT NULL,
	cantidad INT NOT NULL,
	precio_Producto NUMERIC
);

/* Se crea la tabla comisiones */

CREATE TABLE comisiones(
	id_Comision INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	id_Empleado INT NOT NULL,
	total_Comision NUMERIC NOT NULL,
	id_Detalle_Comision INT NOT NULL
);

/* Se crea la tabla Detalle comision */
CREATE TABLE detalle_Comision(
id_Detalle_Comision INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
mes_Comision TIMESTAMP UNIQUE,
porcentaje_Comision INT NOT NULL
);

/* Se crea la tabla pagos */

CREATE TABLE pagos(
	id_Pago INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	id_Venta INT NOT NULL,
	id_Cliente INT NOT NULL,
	fecha_Pago TIMESTAMP NOT NULL, 
	total_Pago NUMERIC NOT NULL,
	total_Restante NUMERIC NOT NULL
);

/* Se crea la tabla devoluciones */

CREATE TABLE devoluciones (
id_Devolucion  INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
id_Venta INT NOT NULL,
id_Producto  INT NOT NULL,
fecha_Devolucion TIMESTAMP,
cantidad_Devuelta INT NOT NULL,
valor_Devolucion NUMERIC,
estado_Producto_Devuelto  CHARACTER VARYING(30),
estado_Producto_Proveedor  CHARACTER VARYING(30)
);

/* Llaves foráneas devoluciones */

ALTER TABLE devoluciones
ADD CONSTRAINT fk_devolucionesVenta
FOREIGN KEY (id_Venta) REFERENCES ventas(id_Venta);

ALTER TABLE devoluciones
ADD CONSTRAINT fk_devolucionesProducto
FOREIGN KEY (id_Producto) REFERENCES productos (id_Producto);

/* Llaves foraneas de la tabla ventas */
ALTER TABLE ventas
ADD CONSTRAINT fk_ventasPedidos 
FOREIGN KEY(id_Pedido) 
REFERENCES pedidos (id_Pedido);

ALTER TABLE ventas
ADD CONSTRAINT fk_ventasClientes 
FOREIGN KEY (id_Cliente) 
REFERENCES clientes (id_Cliente);

ALTER TABLE ventas
ADD CONSTRAINT fk_ventasEmpleados 
FOREIGN KEY (id_Empleado) 
REFERENCES empleados (id_Empleado);

/* Llaves foraneas de la tabla detalle de ventas */
ALTER TABLE detalle_Venta
ADD CONSTRAINT fk_detalle_VentaVentas 
FOREIGN KEY (id_Venta)
REFERENCES ventas (id_Venta);

ALTER TABLE detalle_Venta
ADD CONSTRAINT fk_detalle_VentaProductos
FOREIGN KEY (id_Producto)
REFERENCES productos (id_Producto);

/* llaves foraneas de las tabla pedidos  */
ALTER TABLE pedidos
ADD CONSTRAINT fk_pedidosClientes
FOREIGN KEY (id_Cliente) 
REFERENCES clientes (id_Cliente);

ALTER TABLE pedidos
ADD CONSTRAINT fk_pedidosEmpleados 
FOREIGN KEY (id_Empleado)
REFERENCES empleados (id_Empleado);

/* llaves foraneas de las tabla detalle pedidos  */
ALTER TABLE detalle_Pedido
ADD CONSTRAINT fk_detalle_PedidoPedidos FOREIGN KEY
(id_Pedido) REFERENCES
pedidos (id_Pedido);

ALTER TABLE detalle_Pedido
ADD CONSTRAINT fk_detalle_PedidoProductos
FOREIGN KEY (id_Producto) 
REFERENCES productos (id_Producto);

/* llaves foraneas de las tabla pagos  */
ALTER TABLE pagos
ADD CONSTRAINT fk_pagosVentas
FOREIGN KEY (id_Venta) 
REFERENCES ventas(id_Venta);

ALTER TABLE pagos
ADD CONSTRAINT fk_pagosClientes
FOREIGN KEY (id_Cliente) 
REFERENCES clientes(id_Cliente);

/* llaves foraneas de las tabla comisiones  */
ALTER TABLE comisiones
ADD CONSTRAINT fk_comisionesEmpleados
FOREIGN KEY (id_Empleado)
REFERENCES empleados(id_Empleado);

ALTER TABLE comisiones
ADD CONSTRAINT fk_comisionesDetalleComision
FOREIGN KEY (id_Detalle_Comision)
REFERENCES detalle_Comision(id_Detalle_Comision);

/* llaves foraneas de las tabla compras  */
ALTER TABLE compras 
ADD CONSTRAINT FK_comprasProveedor
FOREIGN KEY (id_Proveedor) 
REFERENCES proveedores (id_Proveedor);

ALTER TABLE detalle_Compra
ADD CONSTRAINT FK_comprasProducto 
FOREIGN KEY (id_Producto) 
REFERENCES productos (id_Producto);

/* llaves foraneas de las tabla usuarios  */
ALTER TABLE usuarios
ADD CONSTRAINT fk_usuariosRoles
FOREIGN KEY (id_Rol)
REFERENCES roles (id_Rol);

ALTER TABLE usuarios
ADD CONSTRAINT fk_usuariosEmpleado
FOREIGN KEY (id_Empleado) 
REFERENCES empleados (id_Empleado);

/* llaves foraneas de las tabla productos */
ALTER TABLE productos
ADD CONSTRAINT fk_productosCategoriaProductos 
FOREIGN KEY (id_Categoria) 
REFERENCES categorias_Productos (id_Categoria);

-- Instertar en la tabla detalle comision
INSERT INTO detalle_Comision (mes_Comision, porcentaje_Comision)
VALUES (current_timestamp, 10),
		('2023-04-01', 5),
		('2023-05-01', 8);
-- Insertar registros en la tabla roles
INSERT INTO roles (nombre_Rol, estado_Rol, modulos_Rol) 
VALUES ('Administrador', 'Activo', 'Módulo A, Módulo B, Módulo C'),
       ('Gerente', 'Activo', 'Módulo B, Módulo C'),
       ('Empleado', 'Activo', 'Módulo C');

-- Insertar registros en la tabla proveedores
INSERT INTO proveedores (nit_Cedula, nombre_Proveedor, correo_Proveedor, direccion_Proveedor, telefono_Proveedor, estado_Proveedor, observacion_Proveedor, nombre_Contacto, fecha_Creacion_Proveedor)
VALUES ('1234567890', 'Proveedor 1', 'proveedor1@email.com', 'Dirección 1', '1234567890', 'Activo', 'Observación 1', 'Contacto 1', current_timestamp),
       ('9876543210', 'Proveedor 2', 'proveedor2@email.com', 'Dirección 2', '9876543210', 'Activo', 'Observación 2', 'Contacto 2', current_timestamp),
       ('5555555555', 'Proveedor 3', 'proveedor3@email.com', 'Dirección 3', '5555555555', 'Inactivo', 'Observación 3', 'Contacto 3', current_timestamp);

-- Insertar registros en la tabla empleados
INSERT INTO empleados (cedula_Empleado, nombre_Empleado, correo, direccion, telefono, estado_Empleado, observacion)
VALUES ('1111111111', 'Empleado 1', 'empleado1@email.com', 'Dirección 1', '1111111111', 'Activo', 'Observación 1'),
       ('2222222222', 'Empleado 2', 'empleado2@email.com', 'Dirección 2', '2222222222', 'Activo', 'Observación 2'),
       ('3333333333', 'Empleado 3', 'empleado3@email.com', 'Dirección 3', '3333333333', 'Inactivo', 'Observación 3');

-- Insertar registros en la tabla clientes
INSERT INTO clientes (nit_O_Cedula_Cliente, nombre_Cliente, apellido_Cliente, correo_Cliente, telefono_Cliente, direccion_Cliente, estado_Cliente)
VALUES ('1000000000', 'Cliente 1', 'Apellido 1', 'cliente1@email.com', '1000000000', 'Dirección 1', 'Activo'),
       ('2000000000', 'Cliente 2', 'Apellido 2', 'cliente2@email.com', '2000000000', 'Dirección 2', 'Activo'),
       ('3000000000', 'Cliente 3', 'Apellido 3', 'cliente3@email.com', '3000000000', 'Dirección 3', 'Inactivo');

-- Insertar registros en la tabla categorias_Productos
INSERT INTO categorias_Productos (nombre_Categoria, estado_Categoria, observacion_Categoria, fecha_Creacion_Categoria)
VALUES ('Categoría 1', 'Activo', 'Observación 1', current_timestamp),
       ('Categoría 2', 'Activo', 'Observación 2', current_timestamp),
       ('Categoría 3', 'Inactivo', 'Observación 3', current_timestamp);

-- Insertar registros en la tabla productos
INSERT INTO productos (id_Categoria, nombre_Producto, cantidad, stock_Maximo, stock_Minimo, precio_Costo, precio_Venta, ganancia, fecha_Creacion_Producto, estado_Producto, observacion)
VALUES (1, 'Producto 1', 100, 200, 50, 10.00, 15.00, 5.00, current_timestamp, 'Activo', 'Observación 1'),
       (2, 'Producto 2', 150, 250, 75, 12.00, 20.00, 8.00, current_timestamp, 'Activo', 'Observación 2'),
       (3, 'Producto 3', 75, 100, 25, 8.00, 14.00, 6.00, current_timestamp, 'Inactivo', 'Observación 3');

-- Insertar registros en la tabla usuarios
INSERT INTO usuarios (id_Rol, id_Empleado, fecha_Creacion_Usuario, nombre_Usuario, correo_Usuario, contrasena_Usuario, estado_Usuario, observacion_Usuario)
VALUES (1, 1, current_timestamp, 'admin', 'admin@email.com', 'contrasena_admin', 'Activo', 'Observación 1'),
       (2, 2, current_timestamp, 'gerente', 'gerente@email.com', 'contrasena_gerente', 'Activo', 'Observación 2'),
       (3, 3, current_timestamp, 'empleado', 'empleado@email.com', 'contrasena_empleado', 'Inactivo', 'Observación 3');

-- Insertar registros en la tabla compras
INSERT INTO compras (id_Proveedor, numero_Factura, fecha_Compra, fecha_RegistroCompra, total_Compra, estado_Compra, foto_Compra, observacion_Compra)
VALUES (1, '0001', current_timestamp, current_timestamp, 500.00, 'Completada', NULL, 'Observación 1'),
       (2, '0002', current_timestamp, current_timestamp, 750.00, 'Pendiente', NULL, 'Observación 2'),
       (3, '0003', current_timestamp, current_timestamp, 400.00, 'Completada', NULL, 'Observación 3');

-- Insertar registros en la tabla detalle_Compra
INSERT INTO detalle_Compra (id_Compra, id_Producto, categoria_Producto, cantidad_Producto, precio_Costo, precio_Venta, subTotal)
VALUES (1, 1, 'Categoría 1', 50, 9.00, 14.00, 700.00),
       (2, 2, 'Categoría 2', 75, 11.00, 18.00, 1350.00),
       (3, 3, 'Categoría 3', 40, 7.00, 12.00, 480.00);

-- Insertar registros en la tabla pedidos
INSERT INTO pedidos (id_Cliente, id_Empleado, numero_Pedido, fecha_Pedido, fecha_Entrega, tipo_Pago, estado_Pedido, estado_Entrega, estado_Pago, total_Pedido)
VALUES (1, 1, 1001, current_timestamp, current_timestamp, 'Efectivo', 'Activo', 'En proceso', 'Por pagar', 1500.00),
       (2, 2, 1002, current_timestamp, current_timestamp, 'Tarjeta', 'Activo', 'Por entregar', 'Por pagar', 1200.00),
       (3, 3, 1003, current_timestamp, current_timestamp, 'Cheque', 'Activo', 'Entregado', 'Por pagar', 1800.00);

-- Insertar registros en la tabla detalle_Pedido
INSERT INTO detalle_Pedido (id_Pedido, id_Producto, cantidad_Producto, precio_Producto)
VALUES (1, 1, 30, 14.00),
       (2, 2, 25, 18.00),
       (3, 3, 20, 12.00);

-- Insertar registros en la tabla ventas
INSERT INTO ventas (id_Pedido, id_Cliente, id_Empleado, numero_Factura, fecha_Venta, estado_Venta, estado_Pago, tipo_Pago, total_Venta)
VALUES (1, 1, 1, 5001, current_timestamp, 'Activo', 'Por pagar', 'Efectivo', 420.00),
       (2, 2, 2, 5002, current_timestamp, 'Activo', 'Por pagar', 'Tarjeta', 675.00),
       (3, 3, 3, 5003, current_timestamp, 'Activo', 'Pagado', 'Cheque', 360.00);

-- Insertar registros en la tabla detalle_Venta
INSERT INTO detalle_Venta (id_Venta, id_Producto, cantidad, precio_Producto)
VALUES (1, 1, 15, 14.00),
       (2, 2, 20, 18.00),
       (3, 3, 12, 12.00);
	   
--INSERTAR EN COMISIONES

INSERT INTO comisiones (id_Empleado, total_Comision, id_Detalle_Comision)
VALUES (1, 42.00,1),
       (2, 81.00,2),
       (3, 28.80,3);
-- Insertar registros en la tabla pagos
INSERT INTO pagos (id_Venta, id_Cliente, fecha_Pago, total_Pago, total_Restante)
VALUES (1, 1, current_timestamp, 420.00, 0.00),
       (2, 2, current_timestamp, 675.00, 0.00),
       (3, 3, current_timestamp, 360.00, 0.00);
-- Insertar registros en la tabla devoluciones
INSERT INTO devoluciones (id_Venta, id_Producto, fecha_Devolucion, cantidad_Devuelta, valor_Devolucion, estado_Producto_Devuelto, estado_Producto_Proveedor)
VALUES (1, 1, current_timestamp, 5, 70.00, 'Devuelto', 'En proceso'),
       (2, 2, current_timestamp, 4, 72.00, 'Devuelto', 'Completado'),
       (3, 3, current_timestamp, 6, 72.00, 'Devuelto', 'En proceso');
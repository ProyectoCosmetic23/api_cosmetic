var DataTypes = require("sequelize").DataTypes;
var _categorias_productos = require("./categorias_productos");
var _clientes = require("./clientes");
var _comisiones = require("./comisiones");
var _compras = require("./compras");
var _detalle_compra = require("./detalle_compra");
var _detalle_pedido = require("./detalle_pedido");
var _detalle_venta = require("./detalle_venta");
var _devoluciones = require("./devoluciones");
var _empleados = require("./empleados");
var _pagos = require("./pagos");
var _pedidos = require("./pedidos");
var _productos = require("./productos");
var _proveedores = require("./proveedores");
var _roles = require("./roles");
var _usuarios = require("./usuarios");
var _ventas = require("./ventas");

function initModels(sequelize) {
  var categorias_productos = _categorias_productos(sequelize, DataTypes);
  var clientes = _clientes(sequelize, DataTypes);
  var comisiones = _comisiones(sequelize, DataTypes);
  var compras = _compras(sequelize, DataTypes);
  var detalle_compra = _detalle_compra(sequelize, DataTypes);
  var detalle_pedido = _detalle_pedido(sequelize, DataTypes);
  var detalle_venta = _detalle_venta(sequelize, DataTypes);
  var devoluciones = _devoluciones(sequelize, DataTypes);
  var empleados = _empleados(sequelize, DataTypes);
  var pagos = _pagos(sequelize, DataTypes);
  var pedidos = _pedidos(sequelize, DataTypes);
  var productos = _productos(sequelize, DataTypes);
  var proveedores = _proveedores(sequelize, DataTypes);
  var roles = _roles(sequelize, DataTypes);
  var usuarios = _usuarios(sequelize, DataTypes);
  var ventas = _ventas(sequelize, DataTypes);

  productos.belongsTo(categorias_productos, { as: "id_categoria_categorias_producto", foreignKey: "id_categoria"});
  categorias_productos.hasMany(productos, { as: "productos", foreignKey: "id_categoria"});
  detalle_pedido.belongsTo(clientes, { as: "id_cliente_cliente", foreignKey: "id_cliente"});
  clientes.hasMany(detalle_pedido, { as: "detalle_pedidos", foreignKey: "id_cliente"});
  detalle_venta.belongsTo(clientes, { as: "id_cliente_cliente", foreignKey: "id_cliente"});
  clientes.hasMany(detalle_venta, { as: "detalle_venta", foreignKey: "id_cliente"});
  pagos.belongsTo(clientes, { as: "id_cliente_cliente", foreignKey: "id_cliente"});
  clientes.hasMany(pagos, { as: "pagos", foreignKey: "id_cliente"});
  pedidos.belongsTo(clientes, { as: "id_cliente_cliente", foreignKey: "id_cliente"});
  clientes.hasMany(pedidos, { as: "pedidos", foreignKey: "id_cliente"});
  ventas.belongsTo(clientes, { as: "id_cliente_cliente", foreignKey: "id_cliente"});
  clientes.hasMany(ventas, { as: "venta", foreignKey: "id_cliente"});
  comisiones.belongsTo(empleados, { as: "id_empleado_empleado", foreignKey: "id_empleado"});
  empleados.hasOne(comisiones, { as: "comisione", foreignKey: "id_empleado"});
  detalle_pedido.belongsTo(empleados, { as: "id_empleado_empleado", foreignKey: "id_empleado"});
  empleados.hasMany(detalle_pedido, { as: "detalle_pedidos", foreignKey: "id_empleado"});
  detalle_venta.belongsTo(empleados, { as: "id_empleado_empleado", foreignKey: "id_empleado"});
  empleados.hasMany(detalle_venta, { as: "detalle_venta", foreignKey: "id_empleado"});
  pedidos.belongsTo(empleados, { as: "id_empleado_empleado", foreignKey: "id_empleado"});
  empleados.hasMany(pedidos, { as: "pedidos", foreignKey: "id_empleado"});
  usuarios.belongsTo(empleados, { as: "id_empleado_empleado", foreignKey: "id_empleado"});
  empleados.hasMany(usuarios, { as: "usuarios", foreignKey: "id_empleado"});
  ventas.belongsTo(empleados, { as: "id_empleado_empleado", foreignKey: "id_empleado"});
  empleados.hasMany(ventas, { as: "venta", foreignKey: "id_empleado"});
  detalle_pedido.belongsTo(pedidos, { as: "id_pedido_pedido", foreignKey: "id_pedido"});
  pedidos.hasMany(detalle_pedido, { as: "detalle_pedidos", foreignKey: "id_pedido"});
  ventas.belongsTo(pedidos, { as: "id_pedido_pedido", foreignKey: "id_pedido"});
  pedidos.hasMany(ventas, { as: "venta", foreignKey: "id_pedido"});
  detalle_compra.belongsTo(productos, { as: "id_producto_producto", foreignKey: "id_producto"});
  productos.hasMany(detalle_compra, { as: "detalle_compras", foreignKey: "id_producto"});
  detalle_pedido.belongsTo(productos, { as: "id_producto_producto", foreignKey: "id_producto"});
  productos.hasMany(detalle_pedido, { as: "detalle_pedidos", foreignKey: "id_producto"});
  detalle_venta.belongsTo(productos, { as: "id_producto_producto", foreignKey: "id_producto"});
  productos.hasMany(detalle_venta, { as: "detalle_venta", foreignKey: "id_producto"});
  devoluciones.belongsTo(productos, { as: "id_producto_producto", foreignKey: "id_producto"});
  productos.hasMany(devoluciones, { as: "devoluciones", foreignKey: "id_producto"});
  compras.belongsTo(proveedores, { as: "id_proveedor_proveedore", foreignKey: "id_proveedor"});
  proveedores.hasMany(compras, { as: "compras", foreignKey: "id_proveedor"});
  usuarios.belongsTo(roles, { as: "id_rol_role", foreignKey: "id_rol"});
  roles.hasMany(usuarios, { as: "usuarios", foreignKey: "id_rol"});
  comisiones.belongsTo(ventas, { as: "id_venta_venta", foreignKey: "id_venta"});
  ventas.hasOne(comisiones, { as: "comisione", foreignKey: "id_venta"});
  detalle_venta.belongsTo(ventas, { as: "id_venta_venta", foreignKey: "id_venta"});
  ventas.hasMany(detalle_venta, { as: "detalle_venta", foreignKey: "id_venta"});
  devoluciones.belongsTo(ventas, { as: "id_venta_venta", foreignKey: "id_venta"});
  ventas.hasMany(devoluciones, { as: "devoluciones", foreignKey: "id_venta"});
  pagos.belongsTo(ventas, { as: "id_venta_venta", foreignKey: "id_venta"});
  ventas.hasMany(pagos, { as: "pagos", foreignKey: "id_venta"});

  return {
    categorias_productos,
    clientes,
    comisiones,
    compras,
    detalle_compra,
    detalle_pedido,
    detalle_venta,
    devoluciones,
    empleados,
    pagos,
    pedidos,
    productos,
    proveedores,
    roles,
    usuarios,
    ventas,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

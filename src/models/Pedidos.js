const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Pedidos = sequelize.define('Pedidos', {
  id_pedido: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_empleado: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  numero_pedido: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  fecha_pedido: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  fecha_entrega: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  tipo_pago: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  estado_pedido: {
    type: DataTypes.STRING(15),
  },
  total_pedido: {
    type: DataTypes.NUMERIC,
    allowNull: false,
  },
}, {
  tableName: 'pedidos',
  timestamps: false
});

module.exports = Pedidos;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Detalle_Pedido = sequelize.define('detalle_pedido', {
  id_detalle_pedido: {
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  id_pedido: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'pedidos',
      key: 'id_pedido'
    }
  },
  id_producto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'productos',
      key: 'id_producto'
    }
  },
  cantidad_producto: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  precio_producto: {
    type: DataTypes.DECIMAL,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'detalle_pedido',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "detalle_pedido_pkey",
      unique: true,
      fields: [
        { name: "id_detalle_pedido" },
      ]
    },
  ]
});

module.exports = Detalle_Pedido;

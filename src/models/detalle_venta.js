const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Detalle_Venta = sequelize.define('detalle_venta', {
  id_detalle_venta: {
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  id_venta: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ventas',
      key: 'id_venta'
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
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  precio_producto: {
    type: DataTypes.DECIMAL,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'detalle_venta',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "detalle_venta_pkey",
      unique: true,
      fields: [
        { name: "id_detalle_venta" },
      ]
    },
  ]
});

module.exports = Detalle_Venta;

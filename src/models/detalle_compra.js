const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Detalle_Compra = sequelize.define('detalle_compra', {
  id_detalle_compra: {
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  id_compra: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_producto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'productos',
      key: 'id_producto'
    }
  },
  categoria_producto: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  cantidad_producto: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  precio_costo: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  precio_venta: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  subtotal: {
    type: DataTypes.DECIMAL,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'detalle_compra',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "detalle_compra_pkey",
      unique: true,
      fields: [
        { name: "id_detalle_compra" },
      ]
    },
  ]
});

module.exports = Detalle_Compra;

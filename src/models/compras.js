const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Compras = sequelize.define('compras', {
  id_compra: {
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  id_proveedor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'proveedores',
      key: 'id_proveedor'
    }
  },
  numero_factura: {
    type: DataTypes.STRING(4),
    allowNull: true
  },
  fecha_compra: {
    type: DataTypes.DATE,
    allowNull: true
  },
  fecha_registrocompra: {
    type: DataTypes.DATE,
    allowNull: true
  },
  total_compra: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  estado_compra: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  foto_compra: {
    type: DataTypes.BLOB,
    allowNull: true
  },
  observacion_compra: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'compras',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "compras_pkey",
      unique: true,
      fields: [
        { name: "id_compra" },
      ]
    },
  ]
});

module.exports = Compras;

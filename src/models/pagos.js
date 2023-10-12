const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Pagos = sequelize.define('pagos', {
  id_pago: {
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
  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'clientes',
      key: 'id_cliente'
    }
  },
  fecha_pago: {
    type: DataTypes.DATE,
    allowNull: false
  },
  total_pago: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  total_restante: {
    type: DataTypes.DECIMAL,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'pagos',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "pagos_pkey",
      unique: true,
      fields: [
        { name: "id_pago" },
      ]
    },
  ]
});

module.exports = Pagos;
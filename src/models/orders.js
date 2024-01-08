const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Orders = sequelize.define('orders', {
  id_order: {
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  id_client: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_employee: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  order_number: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  order_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  payment_type: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  order_state: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  delivery_state: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  payment_state: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  total_order: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  observation_return: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
},
 {
  sequelize,
  tableName: 'orders',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "orders_pkey",
      unique: true,
      fields: [
        { name: "id_order" },
      ]
    },
  ]
});

module.exports = Orders;

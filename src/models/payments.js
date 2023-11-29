const { DataTypes, NOW } = require('sequelize');
const sequelize = require('../config/sequelize');

const Payments = sequelize.define('payments', {
  id_payment: {
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  id_sale: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'sales',
      key: 'id_sale'
    }
  },
  id_order: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'orders',
      key: 'id_order'
    }
  },
  id_client: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'clients',
      key: 'id_client'
    }
  },
  payment_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new NOW(),
  },
  total_payment: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  total_remaining: {
    type: DataTypes.DECIMAL,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'payments',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "payments_pkey",
      unique: false,
      fields: [
        { name: "id_payment" },
      ]
    },
    {
      name: "orders_pkey",
      unique: false,
      fields: [
        { name: "id_order" },
      ]
    },
  ]
});

module.exports = Payments;

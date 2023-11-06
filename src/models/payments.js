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
    allowNull: false,
    references: {
      model: 'sales',
      key: 'id_sale'
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
      unique: true,
      fields: [
        { name: "id_payment" },
      ]
    },
  ]
});

module.exports = Payments;

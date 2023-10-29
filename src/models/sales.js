const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Sales = sequelize.define('sales', {
  id_sale: {
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  id_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
  id_employee: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'employees',
      key: 'id_employee'
    }
  },
  invoice_number: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  sale_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  sale_state: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  payment_state: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  payment_type: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  total_sale: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  observation_return: {
    type: DataTypes.STRING(250),
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'sales',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "sales_pkey",
      unique: true,
      fields: [
        { name: "id_sale" },
      ]
    },
  ]
});

module.exports = Sales;

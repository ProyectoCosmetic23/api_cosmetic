const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Returns = sequelize.define('returns', {
  id_return: {
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
  id_product: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id_product'
    }
  },
  return_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  return_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  return_value: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  returned_product_state: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  provider_product_state: {
    type: DataTypes.STRING(30),
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'returns',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "returns_pkey",
      unique: true,
      fields: [
        { name: "id_return" },
      ]
    },
  ]
});

module.exports = Returns;

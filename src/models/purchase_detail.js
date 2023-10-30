const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Purchase_Detail = sequelize.define('purchase_detail', {
  id_purchase_detail: {
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  id_purchase: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'purchases',
      key: 'id_purchase'
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
  product_category: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  product_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cost_price: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  selling_price: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  sub_total: {
    type: DataTypes.DECIMAL,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'purchase_detail',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "purchase_detail_pkey",
      unique: true,
      fields: [
        { name: "id_purchase_detail" },
      ]
    },
  ]
});

module.exports = Purchase_Detail;

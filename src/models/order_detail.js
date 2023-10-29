const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Order_Detail = sequelize.define('order_detail', {
  id_order_detail: {
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
  id_product: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id_product'
    }
  },
  product_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  product_price: {
    type: DataTypes.DECIMAL,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'order_detail',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "order_detail_pkey",
      unique: true,
      fields: [
        { name: "id_order_detail" },
      ]
    },
  ]
});

module.exports = Order_Detail;

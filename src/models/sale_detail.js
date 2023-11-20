const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Sale_Detail = sequelize.define('sale_detail', {
  id_sale_detail: {
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  id_sale: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_product: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  product_price: {
    type: DataTypes.DECIMAL,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'sale_detail',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "sale_detail_pkey",
      unique: true,
      fields: [
        { name: "id_sale_detail" },
      ]
    },
  ]
});

module.exports = Sale_Detail;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Product_Categories = sequelize.define('product_categories', {
  id_category: {
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  name_category: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: "product_categories_name_category_key"
  },
  state_category: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  observation_category: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  creation_date_category: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'product_categories',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "product_categories_name_category_key",
      unique: true,
      fields: [
        { name: "name_category" },
      ]
    },
    {
      name: "product_categories_pkey",
      unique: true,
      fields: [
        { name: "id_category" },
      ]
    },
  ]
});

module.exports = Product_Categories;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Products = sequelize.define('products', {
  id_product: {
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  id_category: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'product_categories',
      key: 'id_category'
    }
  },
  name_product: {
    type: DataTypes.STRING(80),
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  max_stock: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  min_stock: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cost_price: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  selling_price: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  profit: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  creation_date_product: {
    type: DataTypes.DATE,
    allowNull: true
  },
  state_product: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  observation: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'products',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "products_pkey",
      unique: true,
      fields: [
        { name: "id_product" },
      ]
    },
  ]
});

module.exports = Products;

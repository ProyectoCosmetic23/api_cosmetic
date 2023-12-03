const { DataTypes, NOW } = require('sequelize');
const sequelize = require('../config/sequelize');
const Product_Categories = require('./product_categories');

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
    allowNull: true,
    references: {
      model: 'product_categories',
      key: 'id_category'
    }
  },
  name_product: {
    type: DataTypes.STRING(80),
    allowNull: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  max_stock: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  min_stock: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  cost_price: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  selling_price: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  profit: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  creation_date_product: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: new NOW()
  },
  
  state_product: {
    type: DataTypes.STRING(15),
    allowNull: true,
    defaultValue: "Activo"
  },
  observation: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  reason_anulate: {
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

Products.belongsTo(Product_Categories, { foreignKey: 'id_category' });
module.exports = Products;

const { DataTypes, NOW } = require('sequelize');
const sequelize = require('../config/sequelize');

const Defective_Products = sequelize.define('defective_products', {
  id_defective_product: {
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  id_product: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id_product'
    }
  },

  return_reason: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  return_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new NOW()
  },
  return_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  return_value: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
}, {
  sequelize,
  tableName: 'defective_products',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "defective_products_pkey",
      unique: true,
      fields: [
        { name: "id_defective_product" },
      ]
    },
  ]
});

module.exports = Defective_Products;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Providers = require('./providers');
const Purchase_Detail = require('./purchase_detail');

const Purchases = sequelize.define('purchases', {
  id_purchase: {
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  id_provider: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'providers',
      key: 'id_provider'
    }
  },
  invoice_number: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  purchase_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  record_date_purchase: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW()
  },
  total_purchase: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  state_purchase: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true,
  },
  observation_purchase: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
  ,
  reason_anulate: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'purchases',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "purchases_pkey",
      unique: true,
      fields: [
        { name: "id_purchase" },
      ]
    },
  ]
});

Purchases.belongsTo(Providers, { foreignKey: 'id_provider' });
Purchases.hasMany(Purchase_Detail, { foreignKey: 'id_purchase' });
module.exports = Purchases;

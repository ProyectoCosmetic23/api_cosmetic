const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Comission_Detail = sequelize.define('commission_detail', {
  id_commission_detail: {
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  month_commission: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    unique: "commission_detail_month_commission_key"
  },
  commission_percentage: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'commission_detail',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "commission_detail_month_commission_key",
      unique: true,
      fields: [
        { name: "month_commission" },
      ]
    },
    {
      name: "commission_detail_pkey",
      unique: true,
      fields: [
        { name: "id_commission_detail" },
      ]
    },
  ]
});

module.exports = Comission_Detail;

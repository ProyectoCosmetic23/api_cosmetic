const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const ReportCreditSales = sequelize.define('ReportCreditSales', {
 
  order_month: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  
  total_order_final: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

const ReportCountedSales = sequelize.define('ReportCountedSales', {
 
  order_month: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  
  total_order_final: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

const ReportEmployesSales = sequelize.define('ReportEmployesSales', {
 
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  
  total_order_final: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
module.exports = {
  ReportCountedSales,
  ReportCreditSales,
  ReportEmployesSales
}
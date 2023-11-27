const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Report = sequelize.define('Report', {
  name_product: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  id_product: {
    type: DataTypes.INTEGER,
    
    
allowNull: false,
  },
  order_year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  order_month: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  
order_detail_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

const ReportCard = sequelize.define('ReportCard', {
   
    total_number_orders: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_number_purchases: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    
    total_debts: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    
    total_paid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

module.exports = {Report,ReportCard};
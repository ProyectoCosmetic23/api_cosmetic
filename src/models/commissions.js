const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Comission_Detail = require('./commission_detail');

const Comissions = sequelize.define('commissions', {
    id_commission: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_employee: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'employees',
        key: 'id_employee'
      }
    },
    total_commission: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    id_commission_detail: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'commission_detail',
        key: 'id_commission_detail'
      }
    },
    total_sales:{
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    tableName: 'commissions',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "commissions_pkey",
        unique: true,
        fields: [
          { name: "id_commission" },
        ]
      },
    ]
  });

Comissions.belongsTo(Comission_Detail, { foreignKey: 'id_commission_detail' });

module.exports = Comissions;

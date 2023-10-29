const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

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


module.exports = Comissions;
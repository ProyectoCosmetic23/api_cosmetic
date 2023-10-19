const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Detalle_Comision = sequelize.define('detalle_comision', {
  id_detalle_comision: {
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  mes_comision: {
    type: DataTypes.DATE,
    allowNull: false
  },
  porcentaje_comision: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
    sequelize,
    tableName: 'detalle_comision',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "mes_comision_key",
        unique: true,
        fields: [
          { name: "mes_comision" },
        ]
      },
      {
        name: "porcentaje_comision_key",
        unique: false,
        fields: [
          { name: "porcentaje_comision" },
        ]
      },
      {
        name: "detalle_comision_pkey",
        unique: true,
        fields: [
          { name: "id_detalle_comision" },
        ]
      },
    ]
  });
  
  module.exports = Detalle_Comision;
  

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Comisiones = sequelize.define('comisiones', {
  id_comision: {
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  id_empleado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'empleados',
      key: 'id_empleado'
    },
  },
  total_comision: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  id_detalle_comision: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'detalle_comision',
      key: 'id_detalle_comision'
    }
  },
}, {
  sequelize,
  tableName: 'comisiones',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "comisiones_id_empleado_key",
      unique: false,
      fields: [
        { name: "id_empleado" },
      ]
    },
    {
      name: "comisiones_pkey",
      unique: true,
      fields: [
        { name: "id_comision" },
      ]
    },
    {
      name: "id_detalle_comision_pkey",
      unique: true,
      fields: [
        { name: "id_detalle_comision" },
      ]
    },
  ]
});

module.exports = Comisiones;

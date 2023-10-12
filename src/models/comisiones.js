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
    unique: "comisiones_id_empleado_key"
  },
  id_venta: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ventas',
      key: 'id_venta'
    },
    unique: "comisiones_id_venta_key"
  },
  fecha_comision: {
    type: DataTypes.DATE,
    allowNull: false
  },
  porcentaje_comision: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total_comision: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  observacion_comision: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'comisiones',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "comisiones_id_empleado_key",
      unique: true,
      fields: [
        { name: "id_empleado" },
      ]
    },
    {
      name: "comisiones_id_venta_key",
      unique: true,
      fields: [
        { name: "id_venta" },
      ]
    },
    {
      name: "comisiones_pkey",
      unique: true,
      fields: [
        { name: "id_comision" },
      ]
    },
  ]
});

module.exports = Comisiones;

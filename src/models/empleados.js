const { DataTypes, NOW } = require('sequelize');
const sequelize = require('../config/sequelize');

const Empleados = sequelize.define('empleados', {
  id_empleado: {
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  cedula_empleado: {
    type: DataTypes.STRING(10),
    allowNull: true,
    unique: "empleados_cedula_empleado_key"
  },
  nombre_empleado: {
    type: DataTypes.STRING(80),
    allowNull: true
  },
  correo: {
    type: DataTypes.STRING(80),
    allowNull: true
  },
  direccion: {
    type: DataTypes.STRING(80),
    allowNull: true
  },
  telefono: {
    type: DataTypes.STRING(80),
    allowNull: true
  },
  estado_empleado: {
    type: DataTypes.STRING(15),
    allowNull: true,
    defaultValue: "Activo"
  },
  observacion: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  fecha_creacion_empleado: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: new NOW()
  }
}, {
  sequelize,
  tableName: 'empleados',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "empleados_cedula_empleado_key",
      unique: true,
      fields: [
        { name: "cedula_empleado" },
      ]
    },
    {
      name: "empleados_pkey",
      unique: true,
      fields: [
        { name: "id_empleado" },
      ]
    },
  ]
});

module.exports = Empleados;

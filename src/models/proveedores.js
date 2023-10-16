const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Proveedores = sequelize.define('proveedores', {
  id_proveedor: {
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  nit_cedula: {
    type: DataTypes.STRING(10),
    allowNull: true,
    unique: "proveedores_nit_cedula_key"
  },
  nombre_proveedor: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: "proveedores_nombre_proveedor_key"
  },
  correo_proveedor: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: "proveedores_correo_proveedor_key"
  },
  direccion_proveedor: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: "proveedores_direccion_proveedor_key"
  },
  telefono_proveedor: {
    type: DataTypes.STRING(25),
    allowNull: false,
    unique: "proveedores_telefono_proveedor_key"
  },
  estado_proveedor: {
    type: DataTypes.STRING(15),
    allowNull: true,
    defaultValue: 'Activo',
  },
  observacion_proveedor: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  nombre_contacto: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: "proveedores_nombre_contacto_key"
  },
  fecha_creacion_proveedor: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'proveedores',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "proveedores_correo_proveedor_key",
      unique: true,
      fields: [
        { name: "correo_proveedor" },
      ]
    },
    {
      name: "proveedores_direccion_proveedor_key",
      unique: true,
      fields: [
        { name: "direccion_proveedor" },
      ]
    },
    {
      name: "proveedores_nit_cedula_key",
      unique: true,
      fields: [
        { name: "nit_cedula" },
      ]
    },
    {
      name: "proveedores_nombre_contacto_key",
      unique: true,
      fields: [
        { name: "nombre_contacto" },
      ]
    },
    {
      name: "proveedores_nombre_proveedor_key",
      unique: true,
      fields: [
        { name: "nombre_proveedor" },
      ]
    },
    {
      name: "proveedores_pkey",
      unique: true,
      fields: [
        { name: "id_proveedor" },
      ]
    },
    {
      name: "proveedores_telefono_proveedor_key",
      unique: true,
      fields: [
        { name: "telefono_proveedor" },
      ]
    },
  ]
});

module.exports = Proveedores;

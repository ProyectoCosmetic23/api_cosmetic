const { DataTypes, NOW } = require('sequelize');
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
    unique: "proveedores_nit_cedula_key",
    validate: {
      is: {
        args: /^[0-9]*$/, // Solo números
        msg: "El campo 'nit_cedula' solo debe contener números."
      },
      len: {
        args: [1, 10], // Mínimo 1 y máximo 10 caracteres
        msg: "El campo 'nit_cedula' debe tener entre 1 y 10 caracteres."
      }
    }
  },
  nombre_proveedor: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: "proveedores_nombre_proveedor_key"
  },
  correo_proveedor: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: "proveedores_correo_proveedor_key",
    validate: {
      isEmail: {
        args: true, // Debe ser un correo electrónico válido
        msg: "El campo 'correo_proveedor' debe ser un correo electrónico válido."
      }
    }
  },
  direccion_proveedor: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: "proveedores_direccion_proveedor_key"
  },
  telefono_proveedor: {
    type: DataTypes.STRING(25),
    allowNull: false,
    unique: "proveedores_telefono_proveedor_key",
    validate: {
      is: {
        args: /^[0-9()+\-]*$/, // Solo números, paréntesis y guiones
        msg: "El campo 'telefono_proveedor' solo debe contener números, paréntesis y guiones."
      }
    }
  },
  estado_proveedor: {
    type: DataTypes.STRING(15),
    allowNull: true,
    defaultValue: 'Activo',
    validate: {
      isIn: {
        args: [['Activo', 'Inactivo']], // Solo 'Activo' o 'Inactivo' son válidos
        msg: "El campo 'estado_proveedor' debe ser 'Activo' o 'Inactivo'."
      }
    }
  },
  observacion_proveedor: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      len: {
        args: [0, 100], // Máximo 100 caracteres
        msg: "El campo 'observacion_proveedor' no debe exceder los 100 caracteres."
      }
    }
  },
  nombre_contacto: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: "proveedores_nombre_contacto_key"
  },
  fecha_creacion_proveedor: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new NOW()
  }
},  {
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

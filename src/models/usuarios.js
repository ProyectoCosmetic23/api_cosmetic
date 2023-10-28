const { DataTypes, NOW } = require('sequelize');
const sequelize = require('../config/sequelize');

const Usuarios = sequelize.define('usuarios', {
  id_usuario: {
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  id_rol: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'roles',
      key: 'id_rol'
    }
  },
  id_empleado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'empleados',
      key: 'id_empleado'
    }
  },
  fecha_creacion_usuario: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: new NOW()
  },
  nombre_usuario: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: "usuarios_nombre_usuario_key"
  },
  correo_usuario: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  contrasena_usuario: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  estado_usuario: {
    type: DataTypes.STRING(15),
    allowNull: true,
    defaultValue: "Activo"
  },
  observacion_usuario: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'usuarios',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "usuarios_nombre_usuario_key",
      unique: true,
      fields: [
        { name: "nombre_usuario" },
      ]
    },
    {
      name: "usuarios_pkey",
      unique: true,
      fields: [
        { name: "id_usuario" },
      ]
    },
  ]
});

module.exports = Usuarios;

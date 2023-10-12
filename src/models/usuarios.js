const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('usuarios', {
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
      allowNull: true
    },
    nombre_usuario: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "usuarios_nombre_usuario_key"
    },
    correo_usuario: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    contrasena_usuario: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    estado_usuario: {
      type: DataTypes.STRING(15),
      allowNull: true
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
};

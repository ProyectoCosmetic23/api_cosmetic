const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('roles', {
    id_rol: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre_rol: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "roles_nombre_rol_key"
    },
    estado_rol: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    modulos_rol: {
      type: DataTypes.STRING(150),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'roles',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "roles_nombre_rol_key",
        unique: true,
        fields: [
          { name: "nombre_rol" },
        ]
      },
      {
        name: "roles_pkey",
        unique: true,
        fields: [
          { name: "id_rol" },
        ]
      },
    ]
  });
};

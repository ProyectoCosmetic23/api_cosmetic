const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('empleados', {
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
      allowNull: false
    },
    correo: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    direccion: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    telefono: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    estado_empleado: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    observacion: {
      type: DataTypes.STRING(100),
      allowNull: true
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
};

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('clientes', {
    id_cliente: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nit_o_cedula_cliente: {
      type: DataTypes.STRING(10),
      allowNull: true,
      unique: "clientes_nit_o_cedula_cliente_key"
    },
    nombre_cliente: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    apellido_cliente: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    correo_cliente: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    telefono_cliente: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    direccion_cliente: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    estado_cliente: {
      type: DataTypes.STRING(15),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'clientes',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "clientes_nit_o_cedula_cliente_key",
        unique: true,
        fields: [
          { name: "nit_o_cedula_cliente" },
        ]
      },
      {
        name: "clientes_pkey",
        unique: true,
        fields: [
          { name: "id_cliente" },
        ]
      },
    ]
  });
};

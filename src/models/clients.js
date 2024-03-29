const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Clients = sequelize.define(
  "clients",
  {
    id_client: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    nit_or_id_client: {
      type: DataTypes.STRING(10),
      allowNull: true,
      unique: "clients_nit_or_id_client_key",
    },
    name_client: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    last_name_client: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    email_client: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    phone_client: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    address_client: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    state_client: {
      type: DataTypes.STRING(15),
      allowNull: true,
      defaultValue: "Activo",
    },
    reason_anulate: {
      type: DataTypes.STRING(100),
      allowNull: true,
  
    }
  },
  {
    sequelize,
    tableName: "clients",
    schema: "public",
    timestamps: false,
    indexes: [
      {
        name: "clients_nit_or_id_client_key",
        unique: true,
        fields: [{ name: "nit_or_id_client" }],
      },
      {
        name: "clients_pkey",
        unique: true,
        fields: [{ name: "id_client" }],
      },
    ],
  }
);

module.exports = Clients;

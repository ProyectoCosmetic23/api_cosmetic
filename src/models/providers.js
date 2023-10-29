const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Providers = sequelize.define('providers', {
  id_provider: {
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  nit_cedula: {
    type: DataTypes.STRING(10),
    allowNull: true,
    unique: "providers_nit_cedula_key"
  },
  name_provider: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: "providers_name_provider_key"
  },
  email_provider: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: "providers_email_provider_key"
  },
  address_provider: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: "providers_address_provider_key"
  },
  phone_provider: {
    type: DataTypes.STRING(25),
    allowNull: false,
    unique: "providers_phone_provider_key"
  },
  state_provider: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  observation_provider: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  name_contact: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: "providers_name_contact_key"
  },
  creation_date_provider: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'providers',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "providers_address_provider_key",
      unique: true,
      fields: [
        { name: "address_provider" },
      ]
    },
    {
      name: "providers_email_provider_key",
      unique: true,
      fields: [
        { name: "email_provider" },
      ]
    },
    {
      name: "providers_name_contact_key",
      unique: true,
      fields: [
        { name: "name_contact" },
      ]
    },
    {
      name: "providers_name_provider_key",
      unique: true,
      fields: [
        { name: "name_provider" },
      ]
    },
    {
      name: "providers_nit_cedula_key",
      unique: true,
      fields: [
        { name: "nit_cedula" },
      ]
    },
    {
      name: "providers_phone_provider_key",
      unique: true,
      fields: [
        { name: "phone_provider" },
      ]
    },
    {
      name: "providers_pkey",
      unique: true,
      fields: [
        { name: "id_provider" },
      ]
    },
  ]
});

module.exports = Providers;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Roles = sequelize.define('roles', {
  id_role: {
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  name_role: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: "roles_name_role_key"
  },
  state_role: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  modules_role: {
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
      name: "roles_name_role_key",
      unique: true,
      fields: [
        { name: "name_role" },
      ]
    },
    {
      name: "roles_pkey",
      unique: true,
      fields: [
        { name: "id_role" },
      ]
    },
  ]
});

module.exports = Roles;

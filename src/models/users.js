const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Users = sequelize.define('users', {
  id_user: {
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  id_role: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'roles',
      key: 'id_role'
    }
  },
  id_employee: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'employees',
      key: 'id_employee'
    }
  },
  creation_date_user: {
    type: DataTypes.DATE,
    allowNull: true
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: "users_username_key"
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  state_user: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  observation_user: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'users',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "users_pkey",
      unique: true,
      fields: [
        { name: "id_user" },
      ]
    },
    {
      name: "users_username_key",
      unique: true,
      fields: [
        { name: "username" },
      ]
    },
  ]
});

module.exports = Users;

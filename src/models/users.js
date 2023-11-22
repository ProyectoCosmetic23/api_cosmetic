const { DataTypes, NOW } = require('sequelize');
const sequelize = require('../config/sequelize');

const Users = sequelize.define('users', {
  id_user: {
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  name_role: {
    type: DataTypes.STRING(100),
    allowNull: false
    
  },
  id_card_employee: {
    type: DataTypes.STRING(10),
    allowNull: true,
    //unique: "employees_id_card_employee_key"
  },
  creation_date_user: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: new NOW()
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: "users_username_key"
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  state_user: {
    type: DataTypes.STRING(15),
    allowNull: true,
    defaultValue: "Activo",
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

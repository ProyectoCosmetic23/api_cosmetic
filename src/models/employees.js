const { DataTypes, NOW } = require('sequelize');
const sequelize = require('../config/sequelize');

const Employees = sequelize.define('employees', {
  id_employee: {
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  id_card_employee: {
    type: DataTypes.STRING(10),
    allowNull: true,
    unique: "employees_id_card_employee_key"
  },
  name_employee: {
    type: DataTypes.STRING(80),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(80),
    allowNull: true
  },
  address: {
    type: DataTypes.STRING(80),
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(80),
    allowNull: true
  },
  state_employee: {
    type: DataTypes.STRING(15),
    allowNull: true,
    defaultValue: "Activo"
  },
  observation: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  creation_date_employee: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: new NOW()
  },
  reason_anulate: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'employees',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "employees_id_card_employee_key",
      unique: true,
      fields: [
        { name: "id_card_employee" },
      ]
    },
    {
      name: "employees_pkey",
      unique: true,
      fields: [
        { name: "id_employee" },
      ]
    },
  ]
});


module.exports = Employees;


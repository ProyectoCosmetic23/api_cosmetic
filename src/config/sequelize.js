const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('Cosmetic', 'postgres', '1234', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('cosmetic_db', 'adminuser', 'cosmetic1234', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;

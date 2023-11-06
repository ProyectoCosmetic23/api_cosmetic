const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('cosmetic_db', 'postgres', 'cosmetic1234', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;

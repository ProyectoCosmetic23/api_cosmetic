const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('cosmetic_db', 'postgres', 'cosmetic1234', {
  host: '127.0.0.1',
  dialect: 'postgres',
});

module.exports = sequelize;

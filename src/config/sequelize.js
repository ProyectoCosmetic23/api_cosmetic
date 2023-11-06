const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('cosmetic_db', 'postgres', 'cosmetic1234', {
  host: '192.168.1.14',
  dialect: 'postgres',
});

module.exports = sequelize;

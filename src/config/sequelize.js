const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('cosmetic_db', 'postgres', 'cosmetic1234', {
  host: '186.84.84.33',
  dialect: 'postgres',
});

module.exports = sequelize;

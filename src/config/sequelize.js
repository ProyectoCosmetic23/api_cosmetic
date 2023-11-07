const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('cosmetic_db', 'adminuser', 'Bab9jY9uyhbYyQJX6Pa89Y00KaGe66p6', {
  host: 'dpg-cl527nh82rpc73fp8um0-a',
  dialect: 'postgres',
});

module.exports = sequelize;

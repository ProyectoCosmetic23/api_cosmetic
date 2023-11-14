const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('cosmetic_db', 'postgres', 'cosmetic1234', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;

// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize('cosmetic_db_qyvo', 'adminuser', '8OIXi0HzBZ9hdicPW4abzHM900CCL5wW', {
//   host: 'dpg-cl5a062l7jac73cfphr0-a.ohio-postgres.render.com',
//   dialect: 'postgres',
//   dialectOptions: {
//     ssl: {
//       require: true,
//     },
//   },
// });

// module.exports = sequelize;
const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('cosmetic_dbo2', 'adminuser', 'xjvJfCUjd908qLvSebuc4tmYqkCHFsO1', {
  host: 'dpg-cn19prf109ks73cedbt0-a.oregon-postgres.render.com',
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
    },
  },
});


module.exports = sequelize;


// const sequelize = new Sequelize('cosmetic_db', 'postgres', 'cosmetic1234', {
//   host: 'localhost',
//   dialect: 'postgres',
// });

// module.exports = sequelize;
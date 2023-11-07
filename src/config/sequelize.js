const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('cosmetic_db_qyvo', 'adminuser', '8OIXi0HzBZ9hdicPW4abzHM900CCL5wW', {
  host: 'dpg-cl59km182rpc73fraehg-a.ohio-postgres.render.com',
  dialect: 'postgres',
});

module.exports = sequelize;

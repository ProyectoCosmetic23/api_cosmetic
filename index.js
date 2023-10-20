const express = require('express');
const sequelize = require('./src/config/sequelize');
const empleadosRoutes = require('./src/routes/empleadosRoutes');
const productosRoutes = require('./src/routes/productosRoutes');
const pedidosRoutes = require('./src/routes/pedidosRoutes');
const usuariosRoutes = require('./src/routes/usuariosRoutes');

const app = express();

const PORT = process.env.PORT || 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Successfully connected to PostgreSQL');
  } catch (error) {
    console.error('Unable to connect to PostgreSQL:', error);
  }
})();

app.use('/api', pedidosRoutes);
app.use('/api', empleadosRoutes);
app.use('/api', productosRoutes);
app.use('/api', usuariosRoutes);


app.listen(PORT, () => {

  console.log(`Server is running on port ${PORT}`);
});

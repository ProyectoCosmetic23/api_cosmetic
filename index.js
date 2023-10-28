const express = require('express');
const sequelize = require('./src/config/sequelize');
const empleadosRoutes = require('./src/routes/empleadosRoutes');
const productosRoutes = require('./src/routes/productosRoutes');
const rolesRoutes = require('./src/routes/rolesRoutes');
const pedidosRoutes = require('./src/routes/pedidosRoutes');
const detallePedidoRoutes = require('./src/routes/detallePedidoRoutes');
const ventasRoutes = require('./src/routes/ventasRoutes');
const detalleVentaRoutes = require('./src/routes/detalleVentaRoutes');
const usuariosRoutes = require('./src/routes/usuariosRoutes');
const proveedoresRoutes = require('./src/routes/proveedoresRoutes');
const pagosRoutes = require('./src/routes/pagosRoutes');
const comisionesRoutes = require('./src/routes/comisionesRoutes'); 
const detalleComisionRoutes = require('./src/routes/detalleComisionRoutes'); 
const categoriasRoutes = require('./src/routes/categoriasRoutes');
const comprasRoutes = require('./src/routes/comprasRoutes');
const cors= require("cors");

const app = express();

const PORT = process.env.PORT || 8080;
app.use(cors())

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


app.use('/api', rolesRoutes);
app.use('/api', pedidosRoutes);
app.use('/api', detallePedidoRoutes);
app.use('/api', ventasRoutes);
app.use('/api', detalleVentaRoutes);
app.use('/api', empleadosRoutes);
app.use('/api', productosRoutes);
app.use('/api', usuariosRoutes);
app.use('/api/', proveedoresRoutes);
app.use('/api/', pagosRoutes);
app.use('/api/', comisionesRoutes);
app.use('/api/', detalleComisionRoutes);
app.use('/api', categoriasRoutes);
app.use('/api', comprasRoutes);


app.listen(PORT, () => {

  console.log(`Server is running on port ${PORT}`);
});

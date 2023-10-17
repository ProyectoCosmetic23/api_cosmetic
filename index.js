const express = require('express');
const sequelize = require('./src/config/sequelize');
const rolesRoutes = require('./src/routes/rolesRoutes');
const pedidosRoutes = require('./src/routes/pedidosRoutes');
const detallePedidoRoutes = require('./src/routes/detallePedidoRoutes');
const ventasRoutes = require('./src/routes/ventasRoutes');
const detalleVentaRoutes = require('./src/routes/detalleVentaRoutes');


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


app.use('/api', rolesRoutes);
app.use('/api', pedidosRoutes);
app.use('/api', detallePedidoRoutes);
app.use('/api', ventasRoutes);
app.use('/api', detalleVentaRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

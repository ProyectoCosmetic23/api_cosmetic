const express = require('express');
const sequelize = require('./src/config/sequelize');
const employeesRoutes = require('./src/routes/employeesRoutes');
const productsRoutes = require('./src/routes/productsRoutes');
const usersRoutes = require('./src/routes/usersRoutes');
const rolesRoutes = require('./src/routes/rolesRoutes');
const ordersRoutes = require('./src/routes/ordersRoutes');
const orderDetailRoutes = require('./src/routes/orderDetailRoutes');
const salesRoutes = require('./src/routes/salesRoutes');
const saleDetailRoutes = require('./src/routes/saleDetailRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const purchaseRoutes = require('./src/routes/purchaseRoutes');
const returnsRoutes = require('./src/routes/returnsRoutes');
const clientsRoutes = require('./src/routes/clientsRoutes');

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
app.use('/api', ordersRoutes);
app.use('/api', orderDetailRoutes);
app.use('/api', salesRoutes);
app.use('/api', saleDetailRoutes);
app.use('/api', employeesRoutes);
app.use('/api', productsRoutes);
app.use('/api', usersRoutes);
app.use('/api', categoryRoutes);
app.use('/api', purchaseRoutes);
app.use('/api', returnsRoutes);
app.use('/api', clientsRoutes);


app.listen(PORT, () => {

  console.log(`Server is running on port ${PORT}`);
});

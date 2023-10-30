const express = require('express');
const sequelize = require('./src/config/sequelize');
const rolesRoutes = require('./src/routes/rolesRoutes');
const ordersRoutes = require('./src/routes/ordersRoutes');
const orderDetailRoutes = require('./src/routes/orderDetailRoutes');
const salesRoutes = require('./src/routes/salesRoutes');
const saleDetailRoutes = require('./src/routes/saleDetailRoutes');

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

app.listen(PORT, () => {

  console.log(`Server is running on port ${PORT}`);
});

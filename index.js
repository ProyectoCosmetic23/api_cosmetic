const express = require('express');
const sequelize = require('./src/config/sequelize');
const userRoutes = require('./src/routes/userRoutes');
const clientRoutes = require('./src/routes/clientRoutes')
const categoryRoutes = require('./src/routes/categoryRoutes')
const serviceRoutes = require('./src/routes/serviceRoutes')
const productRoutes = require ('./src/routes/productoutes')

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

app.use('/api', userRoutes);
app.use('/api', clientRoutes);
app.use('/api', categoryRoutes);
app.use('/api', serviceRoutes);
app.use('/api', productRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

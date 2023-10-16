const express = require('express');
const sequelize = require('./src/config/sequelize');
const pedidosRoutes = require('./src/routes/pedidosRoutes');
const proveedoresRoutes = require('./src/routes/proveedoresRoutes');
const pagosRoutes = require('./src/routes/pagosRoutes');


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
app.use('/api/', proveedoresRoutes);
app.use('/api/', pagosRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

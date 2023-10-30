const express = require('express');
const sequelize = require('./src/config/sequelize');
const employeesRoutes = require('./src/routes/employeesRoutes');
const productsRoutes = require('./src/routes/productsRoutes');
const usersRoutes = require('./src/routes/usersRoutes');

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


app.use('/api', employeesRoutes);
app.use('/api', productsRoutes);
app.use('/api', usersRoutes);



app.listen(PORT, () => {

  console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const router = express.Router();
const clientesController= require('../controllers/Clients/clientsController');

//Rutas clientes
router.get('/clientes', clientesController.getAllCustomers);
router.get('/clientes/:id', clientesController.getCustomerById);
router.post('/clientes', clientesController.createCustomer);

//Ruta eliminar cliente utilizando metodo delete
router.delete('/clientes/:id', clientesController.customerDelete);

//Ruta para actualizar un cliente por id utilizando put
router.put('/clientes/:id', clientesController.customerPut);
router.put('/clientes/:id/change-status', clientesController.CustomerChangeStatus)


module.exports= router;




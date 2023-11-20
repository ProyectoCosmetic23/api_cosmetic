const express = require('express');
const router = express.Router();
const clientsController= require('../controllers/Clients/clientsController');

//Rutas clientes
router.get('/clients', clientsController.getAllCustomers);
router.get('/clients/:id', clientsController.getCustomerById);
router.post('/clients', clientsController.createCustomer);

//Ruta eliminar cliente utilizando metodo delete
router.delete('/clients/:id', clientsController.customerDelete);

//Ruta para actualizar un cliente por id utilizando put
router.put('/clients/:id', clientsController.customerPut);
//Ruta para cambiar el estado
router.put('/clients/change-status/:id', clientsController.CustomerChangeStatus);
//Ruta para validar cedula
router.get('/clients-check-cedula', clientsController.checkCedulaAvailability);
//Ruta para validar email
router.get('/clients-check-email', clientsController.checkEmailAvailability);


module.exports= router;




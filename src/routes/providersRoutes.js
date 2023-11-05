const express = require('express');
const router = express.Router();
const providersController = require ('../controllers/Providers/providersController');

router.get('/proveedores', providersController.getAllProv);
router.get('/proveedores/:id', providersController.getProvById);
router.put('/proveedores/:id', providersController.updateProv);
router.post('/proveedores', providersController.createProv);
router.put('/proveedores/estado/:id', providersController.updateState);

module.exports = router;
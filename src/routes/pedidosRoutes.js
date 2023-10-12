const express = require('express');
const router = express.Router();
const pedidosController = require ('../controllers/pedidosController');

// Ruta para obtener todos los usuarios
router.get('/orders', pedidosController.getAllServices);
router.get('/orders/:id', pedidosController.getServiceById);
router.post('/orders', pedidosController.createService);
router.put('/orders/:id', pedidosController.updateService);
router.delete('/orders/:id', pedidosController.deleteService)

module.exports = router;
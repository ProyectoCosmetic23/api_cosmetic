const express = require('express');
const router = express.Router();
const pedidosController = require ('../controllers/pedidosController');

// Ruta para obtener todos los usuarios
router.get('/orders', pedidosController.getAllOrders);
router.get('/orders/:id', pedidosController.getOrderById);
router.post('/orders', pedidosController.createOrder);
router.put('/orders/:id', pedidosController.updateOrder);
router.delete('/orders/:id', pedidosController.deleteOrder)

module.exports = router;
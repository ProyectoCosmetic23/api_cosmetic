const express = require('express');
const router = express.Router();
const ordersController = require ('../controllers/Orders/ordersController');

// Ruta para obtener todos los usuarios
router.get('/orders', ordersController.getAllOrders);
router.get('/orders/:id', ordersController.getOrderById);
router.post('/orders', ordersController.createOrder);
router.put('/orders/anulate/:id', ordersController.anulateOrderById);
router.put('/orders/updateStatus/:id', ordersController.updateDeliveryStatusById);

module.exports = router;
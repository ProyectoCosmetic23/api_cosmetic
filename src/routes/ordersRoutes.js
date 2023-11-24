const express = require('express');
const router = express.Router();
const ordersController = require ('../controllers/Orders/ordersController');
const { validarJWT } = require('../middlewares/validar-jwt');

// Ruta para obtener todos los usuarios
router.get('/orders', validarJWT, ordersController.getAllOrders);
router.get('/orders/:id', validarJWT, ordersController.getOrderById);
router.post('/orders', validarJWT, ordersController.createOrder);
router.put('/orders/anulate/:id', validarJWT, ordersController.anulateOrderById);
router.put('/orders/updateStatus/:id', validarJWT, ordersController.updateDeliveryStatusById);

module.exports = router;
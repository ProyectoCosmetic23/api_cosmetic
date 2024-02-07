const express = require('express');
const router = express.Router();
const ordersController = require ('../controllers/Orders/ordersController');
const { validarJWT } = require('../middlewares/validar-jwt');

// Ruta para obtener todos los usuarios
router.get('/orders', validarJWT, ordersController.getAllOrders);

router.get('/processing_orders', validarJWT, ordersController.getAllProcessingOrders);

router.get('/delivered_orders', validarJWT, ordersController.getAllDeliveredOrders);

router.get('/anulated_orders', validarJWT, ordersController.getAllAnulatedOrders);

router.get('/unpaid_orders', validarJWT, ordersController.getAllUnpaidOrders);

router.get('/paid_orders', validarJWT, ordersController.getAllPaidOrders);

router.get('/completed_orders', validarJWT, ordersController.getAllSales);

router.get('/returned_orders', validarJWT, ordersController.getAllReturnOrders);

router.get('/orders/:id', validarJWT, ordersController.getOrderById);

router.post('/orders', validarJWT, ordersController.createOrder);

router.put('/orders/anulate/:id', validarJWT, ordersController.anulateOrderById);

router.put('/orders/updateStatus/:id', validarJWT, ordersController.updateDeliveryStatusById);

module.exports = router;
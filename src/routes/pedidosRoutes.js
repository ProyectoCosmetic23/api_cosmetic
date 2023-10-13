const express = require('express');
const router = express.Router();
const pedidosController = require ('../controllers/Pedidos/pedidosController');

router.get('/orders', pedidosController.getAllOrders);
router.get('/orders/:id', pedidosController.getOrderById);
router.post('/orders', pedidosController.createOrder);
router.put('/orders/anulate/:id', pedidosController.updateOrder);
router.put('/orders/anulate/:id', pedidosController.updateOrder);
router.delete('/orders/:id', pedidosController.deleteOrder)

module.exports = router;
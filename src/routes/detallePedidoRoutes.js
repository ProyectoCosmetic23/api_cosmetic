const express = require('express');
const router = express.Router();
const detallePedidoController = require ('../controllers/Pedidos/detallePedidoController');

router.put('/orders/updateOrderDetail/:id', detallePedidoController.updateOrderDetail);

module.exports = router;
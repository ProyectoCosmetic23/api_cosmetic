const express = require('express');
const router = express.Router();
const orderDetailController = require ('../controllers/Orders/orderDetailController');

router.put('/orders/updateOrderDetail/:id', orderDetailController.updateOrderDetail);

module.exports = router;
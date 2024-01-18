const express = require('express');
const router = express.Router();
const saleDetailController = require ('../controllers/Sales/saleDetailController');

router.put('/orders/updateSaleDetail/:id', saleDetailController.updateSaleDetail);

module.exports = router;
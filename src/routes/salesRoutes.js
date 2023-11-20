const express = require('express');
const router = express.Router();
const salesController = require ('../controllers/Sales/salesController');

router.get('/sales', salesController.getAllSales);
router.get('/sales/:id', salesController.getSaleById);
router.put('/sales/anulate/:id', salesController.anulateSaleById);

module.exports = router;
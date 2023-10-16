const express = require('express');
const router = express.Router();
const ventasController = require ('../controllers/Ventas/ventasController');

router.get('/sales', ventasController.getAllSales);
router.get('/sales/:id', ventasController.getSaleById);
router.put('/sales/anulate/:id', ventasController.anulateSaleById);

module.exports = router;
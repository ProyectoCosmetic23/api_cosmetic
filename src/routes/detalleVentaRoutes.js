const express = require('express');
const router = express.Router();
const detalleVentaController = require ('../controllers/Ventas/detalleVentaController');

router.put('/orders/updateSaleDetail/:id', detalleVentaController.updateSaleDetail);

module.exports = router;
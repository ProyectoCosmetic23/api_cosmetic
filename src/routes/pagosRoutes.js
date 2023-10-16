const express = require('express');
const router = express.Router();
const pagosController = require ('../controllers/Pagos/pagosController');

router.get('/pagos', pagosController.getAllPagos);
router.get('/pagos/:id', pagosController.getPagoById);
router.post('/pagos', pagosController.createPago);
router.get('/ventas/:id/pagos', pagosController.getPagosVenta);

module.exports = router;
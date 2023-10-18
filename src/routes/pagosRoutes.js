const express = require('express');
const router = express.Router();
const pagosController = require ('../controllers/Pagos/pagosController');

router.get('/pagos', pagosController.getAllPagos);
router.get('/pagos/:id', pagosController.getPagoById);
router.post('/pagos', pagosController.createPago);
router.get('/pagos/:id/ventas', pagosController.getPagosVenta);
router.get('/pagos/:id/clientes', pagosController.getPagosClien);
router.get('/pagos/:id/clientes/:id/ventas', pagosController.getPagosClienVent);

module.exports = router;
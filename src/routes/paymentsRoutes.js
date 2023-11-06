const express = require('express');
const router = express.Router();
const paymentsController = require ('../controllers/Payments/paymentsController');

router.get('/pagos', paymentsController.getAllPay);
router.get('/pagos/:id', paymentsController.getPayById);
router.post('/pagos', paymentsController.createPay);
router.get('/pagos/:id/ventas', paymentsController.getPaySale);
router.get('/pagos/clientes/:id', paymentsController.getPayClien);
router.get('/pagos/:id/clientes/:id/ventas', paymentsController.getPayClienSale);

module.exports = router;
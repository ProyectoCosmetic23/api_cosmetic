const express = require('express');
const router = express.Router();
const paymentsController = require ('../controllers/Payments/paymentsController');

router.get('/payments', paymentsController.getAllPay);
router.get('/payments/:id', paymentsController.getPayById);
router.post('/payments', paymentsController.createPay);
router.get('/payments/:id/sales', paymentsController.getPaySale);
router.get('/payments/clients/:id', paymentsController.getPayClien);
router.get('/payments/:id/clients/:id/sales', paymentsController.getPayClienSale);

module.exports = router;
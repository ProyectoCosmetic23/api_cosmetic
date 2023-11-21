const express = require('express');
const router = express.Router();
const paymentsController = require ('../controllers/Payments/paymentsController');

router.get('/payments', paymentsController.getAllPay);
router.get('/payments/:id', paymentsController.getPayById);
router.post('/payments', paymentsController.createPay);
router.get('/payments/sales/:id', paymentsController.getPaySale);
router.get('/payments/orders/:id', paymentsController.getPayOrder);
router.get('/payments/clients/:id', paymentsController.getPayClien);
router.get('/payments/clients/:id_client/sales/:id_sale', paymentsController.getPayClienSale);
router.get('/payments/clients/:id_client/orders/:id_order', paymentsController.getPayClienOrder);


module.exports = router;
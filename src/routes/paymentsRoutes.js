const express = require('express');
const router = express.Router();
const paymentsController = require ('../controllers/Payments/paymentsController');
const { validarJWT } = require('../middlewares/validar-jwt');

router.get('/payments',validarJWT, paymentsController.getAllPay);
router.get('/payments/:id',validarJWT, paymentsController.getPayById);
router.post('/payments',validarJWT, paymentsController.createPay);
router.get('/payments/sales/:id',validarJWT, paymentsController.getPaySale);
router.get('/payments/orders/:id',validarJWT, paymentsController.getPayOrder);
router.get('/payments/clients/:id',validarJWT, paymentsController.getPayClien);
router.get('/payments/clients/:id_client/sales/:id_sale',validarJWT, paymentsController.getPayClienSale);
router.get('/payments/clients/:id_client/orders/:id_order',validarJWT, paymentsController.getPayClienOrder);


module.exports = router;
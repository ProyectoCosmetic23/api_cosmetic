const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/Purchases/purchaseController');
const { validarJWT } = require('../middlewares/validar-jwt');




router.get('/purchases', validarJWT, purchaseController.getAllShopping);
router.get('/purchases-validate-invoiceexist', purchaseController.validateInvoiceExists)
router.get('/purchases/:id', validarJWT, purchaseController.getShoppingById);
router.post('/purchases',validarJWT, purchaseController.createShop);
router.put('/purchases/anulate/:id',validarJWT, purchaseController.anulateShopById);

module.exports = router;

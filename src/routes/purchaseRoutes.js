const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/Purchases/purchaseController');

router.get('/purchases', purchaseController.getAllShopping);
router.get('/purchases-validate-invoiceexist', purchaseController.validateInvoiceExists)
router.get('/purchases/:id', purchaseController.getShoppingById);
router.post('/purchases', purchaseController.createShop);
router.put('/purchases/anulate/:id', purchaseController.anulateShopById);

module.exports = router;

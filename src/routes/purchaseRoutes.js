const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/Purchases/purchaseController');

router.get('/purchase', purchaseController.getAllShopping);
router.get('/purchase/:id', purchaseController.getShoppingById);
router.post('/purchase', purchaseController.createShop);
router.put('/purchase/:id', purchaseController.anulateShopById);

module.exports = router;

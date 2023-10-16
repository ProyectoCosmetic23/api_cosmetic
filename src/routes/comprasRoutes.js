const express = require('express');
const router = express.Router();
const comprasController = require('../controllers/Compras/comprasController');

router.get('/compras', comprasController.getAllShopping);
router.get('/compras/:id', comprasController.getShoppingById);
router.post('/compras', comprasController.createShop);
router.put('/compras/:id', comprasController.anulateShopById);

module.exports = router;

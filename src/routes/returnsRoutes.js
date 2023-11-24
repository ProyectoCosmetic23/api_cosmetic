const express = require('express');
const router = express.Router();
const returnsController = require ('../controllers/Returns/returnsController');

router.get('/returns', returnsController.getAllReturns);
router.get('/returns/:id', returnsController.getReturnById);
router.post('/returns/processReturn', returnsController.processReturn);
router.post('/returns/createNewSale', returnsController.createNewSaleAndCancelOldSale);
// router.get('/returns/getSaleById/:id', returnsController.getSaleById);

//Obterner un pedido
router.get('/returns/:id', returnsController.getOrderById )
//Obtener detalle de pedido
router.get('/returns/productByIdOrder/:id', returnsController.getProductByIdOrder)

module.exports = router;

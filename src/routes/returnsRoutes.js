const express = require('express');
const router = express.Router();
const returnsController = require ('../controllers/Returns/returnsController');

router.get('/returns', returnsController.getAllReturns);
router.get('/returns/:id', returnsController.getReturnById);
router.post('/returns/processReturn', returnsController.processReturn);
router.post('/returns/createNewSale', returnsController.createNewSaleAndCancelOldSale);

module.exports = router;
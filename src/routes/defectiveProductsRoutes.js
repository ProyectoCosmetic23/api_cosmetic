const express = require('express');
const router = express.Router();
const returnsController = require ('../controllers/Defective_Products/defectiveProductsController');

router.get('/defectiveProducts', returnsController.getAllDefectiveProducts);

module.exports = router;
const express = require('express');
const router = express.Router();
const productsController = require('../controllers/Products/productsController');

// Rutas de productos
router.get('/productcs', productsController.getAllProducts);
router.get('/productcs/:id', productsController.getProductsById);
router.post('/productcs', productsController.createProducts);

// Ruta específica para actualizar un producto por ID (utiliza PUT)
router.put('/productcs/:id', productsController.productsPut);
router.put('/productcs/changeState/:id', productsController.productsChangeStatus);


module.exports = router;


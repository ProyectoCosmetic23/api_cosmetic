const express = require('express');
const router = express.Router();
const productsController = require('../controllers/Products/productsController');

// Rutas de productos
router.get('/products', productsController.getAllProducts);
router.get('/products/:id', productsController.getProductsById);
router.post('/products', productsController.createProducts);

// Ruta específica para actualizar un producto por ID (utiliza PUT)
router.put('/products/:id', productsController.productsPut);
router.put('/products/cambiarEstado/:id', productsController.productsChangeStatus);

module.exports = router;


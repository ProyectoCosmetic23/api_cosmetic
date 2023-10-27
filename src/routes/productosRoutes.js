const express = require('express');
const router = express.Router();
const productosController = require('../controllers/Productos/productosController');

// Rutas de productos
router.get('/productos', productosController.getAllProducts);
router.get('/productos/:id', productosController.getProductsById);
router.post('/productos', productosController.createProducts);

// Ruta específica para actualizar un producto por ID (utiliza PUT)
router.put('/productos/:id', productosController.productsPut);
router.put('/productos/cambiarEstado/:id', productosController.productsChangeStatus);

module.exports = router;


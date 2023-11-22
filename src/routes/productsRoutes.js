const express = require('express');
const router = express.Router();
const productsController = require('../controllers/Products/productsController');
const { validarJWT } = require('../middlewares/validar-jwt');
// Rutas de productos
router.get('/productcs',validarJWT, productsController.getAllProducts);
router.get('/productcs/:id',validarJWT, productsController.getProductsById);
router.post('/productcs', validarJWT,productsController.createProducts);
router.put('/productcs/retire/:id', validarJWT, productsController.retireProduct);
router.get('/productcs-validate-productexist', productsController.validateProductExists);
// Ruta específica para actualizar un producto por ID (utiliza PUT)
router.put('/productcs/:id',validarJWT, productsController.productsPut);
router.put('/productcs/changeState/:id',validarJWT, productsController.productsChangeStatus);


module.exports = router;


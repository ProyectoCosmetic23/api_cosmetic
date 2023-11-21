const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/Categories/categoryController');
const { validarJWT } = require('../middlewares/validar-jwt');
// Rutas de categorías
router.get('/categories',validarJWT, categoriesController.getAllCategories);
router.get('/categories-validate-categoryexist', categoriesController.validateCategoryExists);
router.get('/categories/:id',validarJWT, categoriesController.getCategoryById);
router.post('/categories', validarJWT, categoriesController.createCategory);


// Ruta específica para actualizar una categoría por ID (utiliza PUT)
router.put('/categories/:id',validarJWT, categoriesController.categoryPut);
router.put('/categories/change-status/:id',validarJWT, categoriesController.CategoryChangeStatus);

module.exports = router;

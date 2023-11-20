const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/Categories/categoryController');

// Rutas de categorías
router.get('/categories', categoriesController.getAllCategories);
router.get('/categories-validate-categoryexist', categoriesController.validateCategoryExists);
router.get('/categories/:id', categoriesController.getCategoryById);
router.post('/categories', categoriesController.createCategory);


// Ruta específica para actualizar una categoría por ID (utiliza PUT)
router.put('/categories/:id', categoriesController.categoryPut);
router.put('/categories/change-status/:id', categoriesController.CategoryChangeStatus);

module.exports = router;

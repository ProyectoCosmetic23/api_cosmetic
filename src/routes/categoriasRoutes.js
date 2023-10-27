const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/Categorias/categoriasController');

// Rutas de categorías
router.get('/categorias', categoriasController.getAllCategories);
router.get('/categorias/:id', categoriasController.getCategoryById);
router.post('/categorias', categoriasController.createCategory);

// Ruta para eliminar una categoría (utiliza DELETE)
router.delete('/categorias/:id', categoriasController.categoriaDelete);

// Ruta específica para actualizar una categoría por ID (utiliza PUT)
router.put('/categorias/:id', categoriasController.categoryPut);
router.put('/categorias/:id/change-status', categoriasController.CategoryChangeStatus);

module.exports = router;

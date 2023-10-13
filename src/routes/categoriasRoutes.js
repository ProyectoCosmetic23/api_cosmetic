const express = require('express');
const router = express.router();
const categoriasController = require('../controllers/categoriasController');

// Ruta para las categorías 

router.get('/categorias', categoriasController.getCategorias);
router.get('/categorias/:id', categoriasController.getCategoriaById);
router.post('/categorias', categoriasController.createCategoria);
router.put('/categorias/:id', categoriasController.updateCategoria);
router.delete('/categorias/:id', categoriasController.deleteCategoria)

module.exports = router;

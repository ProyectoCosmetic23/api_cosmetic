const express = require('express');
const router = express.router();
const comprasController = require('../controllers/comprasController');

// Ruta para las compras
router.get('/compras', comprasController.getCompras);
router.get('/compras:id', comprasController.getComprasId);
router.post('/compras', comprasController.createCompra);
router.put('/compras', comprasController.updateCompras);

module.exports = router;
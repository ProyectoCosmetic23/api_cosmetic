const express = require('express');
const router = express.Router();
const proveedoresController = require ('../controllers/Proveedores/proveedoresController');

router.get('/proveedores', proveedoresController.getAllProv);
router.get('/proveedores/:id', proveedoresController.getProvById);
router.put('/proveedores/:id', proveedoresController.updateProv);
router.post('/proveedores', proveedoresController.createProv);
router.put('/proveedores/:id/estado', proveedoresController.updateEstado);

module.exports = router;
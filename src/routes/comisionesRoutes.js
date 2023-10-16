const express = require('express');
const router = express.Router();
const comisionesController = require ('../controllers/Comisiones/comisionesController');

router.get('/comisiones', comisionesController.getAllComs);
router.get('/comisiones/:id', comisionesController.getComsById);
router.put('/comisiones/:id/estado', comisionesController.updateEstado);
router.post('/comisiones', comisionesController.createComs);

module.exports = router;
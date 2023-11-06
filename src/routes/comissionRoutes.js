const express = require('express');
const router = express.Router();
const comissionController = require ('../controllers/Comissions/comissionController');

router.get('/comisiones', comissionController.getAllComs);
router.get('/comisiones/:id', comissionController.getComsById);
router.post('/comisiones', comissionController.createComs);
router.get('/comisiones/empleado/:id', comissionController.getComsEmploy);
router.get('/comisiones/detalle/:id', comissionController.getComsDetailId);


module.exports = router;
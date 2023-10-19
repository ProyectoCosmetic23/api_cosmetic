const express = require('express');
const router = express.Router();
const comisionesController = require ('../controllers/Comisiones/comisionesController');

router.get('/comisiones', comisionesController.getAllComs);
router.get('/comisiones/:id', comisionesController.getComsById);
router.post('/comisiones', comisionesController.createComs);
router.get('/comisiones/empleado/:id', comisionesController.getComsEmpleado);

module.exports = router;
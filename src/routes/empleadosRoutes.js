const express = require('express');
const router = express.Router();
const empleadosController = require('../controllers/Empleados/empleadosController');

// Rutas de categorías
router.get('/empleados', empleadosController.getAllEmployes);
router.get('/empleados/:id', empleadosController.getEmployesById);
router.post('/empleados', empleadosController.createEmploye);

// Ruta específica para actualizar una categoría por ID (utiliza PUT)
router.put('/empleados/:id', empleadosController.employePut);
router.put('/empleados/cambiarEstado/:id', empleadosController.employeChangeStatus);

module.exports = router;


const express = require('express');
const router = express.Router();
const employeesController = require('../controllers/Employees/employeesController');


// Rutas de empleados
router.get('/employees', employeesController.getAllEmployees);
router.get('/employees/:id', employeesController.getEmployeesById);
router.post('/employees', employeesController.createEmployee);

// Ruta específica para actualizar un empleado por ID (utiliza PUT)
router.put('/employees/:id', employeesController.employeePut);
router.put('/employees/cambiarEstado/:id', employeesController.employeeChangeStatus);

router.get('/employees-check-cedula', employeesController.checkCedulaAvailability);
router.get('/employees-check-email', employeesController.checkEmailAvailability);



module.exports = router;
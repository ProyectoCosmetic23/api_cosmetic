const express = require('express');
const router = express.Router();
const employeesController = require('../controllers/Employees/employeesController');
const { validarJWT } = require('../middlewares/validar-jwt');



// Rutas de empleados
router.get('/employees',validarJWT, employeesController.getAllEmployees);
router.get('/employees/:id',validarJWT, employeesController.getEmployeesById);
router.post('/employees',validarJWT, employeesController.createEmployee);

// Ruta específica para actualizar un empleado por ID (utiliza PUT)
router.put('/employees/:id',validarJWT, employeesController.employeePut);
router.put('/employees/changeState/:id',validarJWT, employeesController.employeeChangeStatus);

router.get('/employees-check-cedula', employeesController.checkCedulaAvailability);
router.get('/employees-check-email', employeesController.checkEmailAvailability);



module.exports = router;
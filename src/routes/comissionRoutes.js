const express = require('express');
const router = express.Router();
const comissionController = require ('../controllers/Comissions/comissionController');
const { validarJWT } = require('../middlewares/validar-jwt');

router.get('/commissions',validarJWT, comissionController.getAllComs);
router.get('/commissions/:id',validarJWT, comissionController.getComsById);
router.post('/commissions',validarJWT, comissionController.createComs);
router.get('/commissions/employee/:id',validarJWT, comissionController.getComsEmploy);
router.get('/commissions/detail/:id',validarJWT, comissionController.getComsDetailId);
router.get('/commissions/sales/:id_employee/:month',validarJWT, comissionController.getSalesByEmployeeAndMonth);


module.exports = router;
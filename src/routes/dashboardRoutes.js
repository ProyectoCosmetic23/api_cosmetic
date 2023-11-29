const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController/dashboardController');
const { validarJWT } = require('../middlewares/validar-jwt');
// Rutas de categorías
router.get('/report-products',validarJWT, dashboardController.getReportProducts);
router.get('/report-sales',validarJWT, dashboardController.getReportSales);
router.get('/report-cards',validarJWT, dashboardController.getReportCards);
router.get('/report-employees',validarJWT, dashboardController.getReportEmployees);


module.exports = router;

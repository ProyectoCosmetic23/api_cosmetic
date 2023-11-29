const express = require('express');
const router = express.Router();
const providersController = require ('../controllers/Providers/providersController');
const { validarJWT } = require('../middlewares/validar-jwt');

router.get('/providers',validarJWT, providersController.getAllProv);
router.get('/providers/:id', providersController.getProvById);
router.put('/providers/:id', providersController.updateProv);
router.post('/providers', providersController.createProv);
router.put('/providers/state/:id', providersController.updateState);

router.get('/providers-check-cedula', providersController.checkCedulaAvailability);
router.get('/providers-check-email', providersController.checkEmailAvailability);

module.exports = router;    
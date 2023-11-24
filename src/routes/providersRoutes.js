const express = require('express');
const router = express.Router();
const providersController = require ('../controllers/Providers/providersController');
const { validarJWT } = require('../middlewares/validar-jwt');

router.get('/providers',validarJWT, providersController.getAllProv);
router.get('/providers/:id',validarJWT, providersController.getProvById);
router.put('/providers/:id',validarJWT, providersController.updateProv);
router.post('/providers',validarJWT, providersController.createProv);
router.put('/providers/state/:id',validarJWT, providersController.updateState);

module.exports = router;
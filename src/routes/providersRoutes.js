const express = require('express');
const router = express.Router();
const providersController = require ('../controllers/Providers/providersController');

router.get('/providers', providersController.getAllProv);
router.get('/providers/:id', providersController.getProvById);
router.put('/providers/:id', providersController.updateProv);
router.post('/providers', providersController.createProv);
router.put('/providers/:id/estado', providersController.updateState);

module.exports = router;
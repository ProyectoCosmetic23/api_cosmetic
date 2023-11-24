const express = require('express');
const router = express.Router();
const comissionDetailController = require ('../controllers/Comissions/comissionDetailController');

router.get('/detailComs',validarJWT, comissionDetailController.getAllDetails);
router.get('/commissions/detailComs/:id',validarJWT, comissionDetailController.getDetailComsById);
router.post('/commissions/detailComs',validarJWT, comissionDetailController.createDetaileCom);

module.exports = router;
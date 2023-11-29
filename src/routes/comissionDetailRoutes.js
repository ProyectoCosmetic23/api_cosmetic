const express = require('express');
const router = express.Router();
const comissionDetailController = require ('../controllers/Comissions/comissionDetailController');
const { validarJWT } = require('../middlewares/validar-jwt');

router.get('/detailComs', comissionDetailController.getAllDetails);
router.get('/commissions/detailComs/:id', comissionDetailController.getDetailComsById);
router.post('/commissions/detailComs', comissionDetailController.createDetaileCom);

module.exports = router;
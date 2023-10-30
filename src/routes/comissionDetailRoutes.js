const express = require('express');
const router = express.Router();
const comissionDetailController = require ('../controllers/Comissions/comissionDetailController');

router.get('/detalleComs', comissionDetailController.getAllDetails);
router.get('/comisiones/detalleComs/:id', comissionDetailController.getDetailComsById);
router.post('/comisiones/detalleComs', comissionDetailController.createDetaileCom);

module.exports = router;
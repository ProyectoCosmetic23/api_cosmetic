const express = require('express');
const router = express.Router();
const detalleComisionesController = require ('../controllers/Comisiones/detalleComisionController');

router.get('/detalleComs', detalleComisionesController.getAllDetalles);
router.get('/comisiones/detalleComs/:id', detalleComisionesController.getDetallComsById);
router.post('/comisiones/detalleComs', detalleComisionesController.createDetalleCom);

module.exports = router;
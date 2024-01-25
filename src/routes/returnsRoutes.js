const express = require('express');
const router = express.Router();
const returnsController = require ('../controllers/Returns/returnsController');
const { validarJWT } = require('../middlewares/validar-jwt');

//Procesar una devolución
router.post('/processReturn', returnsController.processReturn);

//Obterner un pedido
router.get('/returns_detail/:id', returnsController.getReturnById )

//Obterner un pedido
router.get('/returns/:id', returnsController.getOrderById )

//devolver producto
router.put('/returns/retire/:id', returnsController.retireProduct);

//anular pedido
router.put('/returns/anulate/:id', validarJWT, returnsController.anulateOrderByIdR);

module.exports = router;

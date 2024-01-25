const express = require('express');
const router = express.Router();
const returnsController = require ('../controllers/Returns/returnsController');
const { validarJWT } = require('../middlewares/validar-jwt');

//Procesar una devolución
router.post('/processReturn', returnsController.processReturn);

//Obterner un pedido
router.get('/returns_detail/:id', returnsController.getReturnById );

//Obterner un pedido
router.get('/returns/:id', returnsController.getOrderById );

module.exports = router;

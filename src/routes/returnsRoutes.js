const express = require('express');
const router = express.Router();
const returnsController = require ('../controllers/Returns/returnsController');

//Procesar una devolución
router.post('/processReturn', returnsController.processReturn);

//Obterner un pedido
router.get('/returns_detail/:id', returnsController.getReturnById );

//Obterner un pedido
<<<<<<< HEAD
router.get('/returns/:id', returnsController.getOrderById )

module.exports = router;
=======
router.get('/returns/:id', returnsController.getOrderById );

module.exports = router;
>>>>>>> 8f73f51771411962d79b6daf449a101c1f81615d

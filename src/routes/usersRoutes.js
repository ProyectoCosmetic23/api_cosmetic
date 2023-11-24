const express = require('express');
const router = express.Router();
const usersController = require('../controllers/Users/usersController');
const { validarJWT } = require('../middlewares/validar-jwt');


// Rutas de autenticación
router.get('/ruta-protegida', validarJWT, (req, res) => {
    // Lógica para la ruta protegida
    res.json({ mensaje: 'Esta es una ruta protegida' });
  });
router.get('/users',validarJWT, usersController.getAllUsers);
router.get('/users/:id', usersController.getUserById);
router.post('/users', usersController.createUser);
router.put('/users/:id',validarJWT, usersController.updateUser);
router.put('/users/state/:id', usersController.updateUserState);
router.post('/users/login' , usersController.loginUser);
router.post('/users/recover', usersController.forgotPassword);
router.post('/users-password', usersController.changePassword);

module.exports = router;
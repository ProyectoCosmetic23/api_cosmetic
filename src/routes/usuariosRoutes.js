const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/Usuarios/usuariosController');

// Rutas de autenticación

router.get('/usuarios', usuariosController.getAllUsers);
router.get('/usuarios/:id', usuariosController.getUserById);
router.post('/usuarios', usuariosController.createUser);
router.put('/usuarios/:id', usuariosController.updateUser);
router.put('/usuarios/estado/:id', usuariosController.updateUserState);
router.post('/usuarios/login' , usuariosController.loginUser);
router.post('/usuarios/recuperar', usuariosController.forgotPassword);
router.post('/change-password', usuariosController.changePassword);

module.exports = router;
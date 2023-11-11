const express = require('express');
const router = express.Router();
const usersController = require('../controllers/Users/usersController');

// Rutas de autenticación

router.get('/users', usersController.getAllUsers);
router.get('/users/:id', usersController.getUserById);
router.post('/users', usersController.createUser);
router.put('/users/:id', usersController.updateUser);
router.put('/users/state/:id', usersController.updateUserState);
router.post('/users/login' , usersController.loginUser);
router.post('/users/recover', usersController.forgotPassword);
router.post('/users-password', usersController.changePassword);

module.exports = router;
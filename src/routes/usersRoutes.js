const express = require('express');
const router = express.Router();
const usersController = require('../controllers/Users/usersController');

// Rutas de autenticación

router.get('/Users', usersController.getAllUsers);
router.get('/Users/:id', usersController.getUserById);
router.post('/Users', usersController.createUser);
router.put('/Users/:id', usersController.updateUser);
router.put('/Users/state/:id', usersController.updateUserState);
router.post('/Users/login' , usersController.loginUser);
router.post('/Users/recover', usersController.forgotPassword);
router.post('/change-password', usersController.changePassword);

module.exports = router;
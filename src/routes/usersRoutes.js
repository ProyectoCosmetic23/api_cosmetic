const express = require('express');
const router = express.Router();
const usersController = require('../controllers/Users/usersController');
const { validarJWT } = require('../middlewares/validar-jwt');


// Rutas de autenticación
<<<<<<< HEAD

router.get('/Users', usersController.getAllUsers);
router.get('/Users/:id', usersController.getUserById);
router.post('/Users', usersController.createUser);
router.put('/Users/:id', usersController.updateUser);
router.put('/Users/state/:id', usersController.updateUserState);
router.post('/Users/login' , usersController.loginUser);
router.post('/Users/recover', usersController.forgotPassword);
router.post('/change-password', usersController.changePassword);
//Ruta para validar email
// router.get('/users-check-email', usersController.checkEmailAvailability);
//Ruta para buscar el empleado y obtener su correo
router.get('/Users/employeeByCard/:id_card_employee', usersController.employeeByCard);




=======
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
>>>>>>> d091e2b0713ecc91c4991d421b9f5f37a533a0af

module.exports = router;
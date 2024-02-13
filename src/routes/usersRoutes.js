const express = require("express");
const router = express.Router();
const usersController = require("../controllers/Users/usersController");
const { validarJWT } = require("../middlewares/validar-jwt");

// Rutas de autenticación
<<<<<<< HEAD
router.get('/ruta-protegida', validarJWT, (req, res) => {
    // Lógica para la ruta protegida
    res.json({ mensaje: 'Esta es una ruta protegida' });
  });
router.get('/users', usersController.getAllUsers);
router.get('/users/:id', usersController.getUserById);
router.post('/users', usersController.createUser);
router.put('/users/:id',validarJWT, usersController.updateUser);
router.put('/users/state/:id', usersController.updateUserState);
router.post('/users/login' , usersController.loginUser);
router.post('/users/recover', usersController.forgotPassword);
router.post('/change-password/:token', usersController.changePassword);

=======
router.get("/ruta-protegida", validarJWT, (req, res) => {
  // Lógica para la ruta protegida
  res.json({ mensaje: "Esta es una ruta protegida" });
});
router.get("/users", usersController.getAllUsers);
router.get("/users/:id", usersController.getUserById);
router.post("/users", usersController.createUser);
router.put("/users/:id", validarJWT, usersController.updateUser);
router.put("/users/state/:id", usersController.updateUserState);
router.post("/users/login", usersController.loginUser);
router.post("/users/recover", usersController.forgotPassword);
router.post("/change-password/:token", usersController.changePassword);
>>>>>>> d1828e4d598f4eb0dc2c00a4df7f9f0b3aaeaa68
//Ruta para buscar el empleado y obtener su correo
router.get(
  "/Users/employeeByCard/:id_card_employee",
  usersController.employeeByCard
);

//ruta para validar usuario existente
// router.get('/Users-check-empleado', usersController.checkEmployeeAvailability);

module.exports = router;

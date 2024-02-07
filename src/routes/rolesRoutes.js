const express = require('express');
const router = express.Router();
const rolesController = require ('../controllers/Roles/rolesController');
const { validarJWT } = require('../middlewares/validar-jwt');

router.get('/roles', validarJWT,  rolesController.getAllRoles);
router.get('/roles/:id', validarJWT, rolesController.getRoleById);
router.get('/validate-role/:name', validarJWT, rolesController.validateRoleName);
router.post('/roles', validarJWT, rolesController.createRole);
router.put('/roles/update/:id', validarJWT, rolesController.updateRole);
router.put('/roles/updateStatus/:id', validarJWT, rolesController.updateRoleStatus);

module.exports = router;
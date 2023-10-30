const express = require('express');
const router = express.Router();
const rolesController = require ('../controllers/Roles/rolesController');

router.get('/roles', rolesController.getAllRoles);
router.get('/roles/:id', rolesController.getRoleById);
router.post('/roles', rolesController.createRole);
router.put('/roles/update/:id', rolesController.updateRole);
router.put('/roles/updateStatus/:id', rolesController.updateRoleStatus);

module.exports = router;
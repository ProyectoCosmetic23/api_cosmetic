// pedidosController.js
const Roles = require('../../models/roles');

// Obtener todos los roles
const getAllRoles = async (req, res) => {
    try {
        const roles = await Roles.findAll();
        if (roles.length === 0) {
            return res.status(404).json({ message: "No hay roles registrados" })
        }
        var lista_Roles = []
        for (let role of roles) {
            var id_rol = role.id_rol;
            console.log(id_rol);
            var nombre_rol = role.nombre_rol;
            console.log(nombre_rol);
            var estado_rol = role.estado_rol;
            console.log(estado_rol);
            var modulos_string = role.modulos_rol;
            console.log(modulos_string);
            var modulos_array = modulos_string.split(", ");
            console.log(modulos_array);
            var rol_converted = {
                id_rol: id_rol,
                nombre_rol: nombre_rol,
                estado_rol: estado_rol,
                modulos_rol: modulos_array
            }
            lista_Roles.push(rol_converted)
        }
        res.json(lista_Roles);
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Obtener un rol por ID
async function getRoleById(req, res) {
    const { id } = req.params;
    try {
        const role = await Roles.findByPk(id);
        if (!role) {
            return res.status(404).json({ error: 'Rol no encontrado.' });
        }
        var id_role = role.id_rol;
        var nombre_rol = role.nombre_rol;
        var estado_rol = role.estado_rol;
        var modulos_string = role.modulos_rol
        var modulos_array = modulos_string.split(", ");
        var role_detail = {
            id_rol: id_role,
            nombre_rol: nombre_rol,
            estado_rol: estado_rol,
            modulos_rol: modulos_array
        }
        res.json({ role_detail });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el rol.' });
    }
}

// Crear un rol
async function createRole(req, res) {
    const { nombre_rol, modulos_rol } = req.body;
    estado_rol = "Activo";
    modulos_string = modulos_rol.join(", ");
    try {
        const nuevo_rol = await Roles.create({
            nombre_rol: nombre_rol,
            estado_rol: estado_rol ,
            modulos_rol: modulos_string
        });
        res.status(201).json({ nuevo_rol });
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el rol.' });
        console.log(error.message);
    }
}

// Cambiar el estado de un rol
async function updateRoleStatus(req, res) {
    const { id } = req.params;
    try {
        const role = await Roles.findByPk(id);
        var estado_rol = "";
        if (role.estado_rol == "Activo") {
            estado_rol = "Inactivo";
        } else if (role.estado_rol == "Inactivo") {
            estado_rol = "Activo";
        }

        if (!role) {
            return res.status(404).json({ error: 'Rol no encontrado.' });
        }

        await role.update({
            estado_rol: estado_rol
        });
        res.json(role);
    } catch (error) {
        res.status(500).json({ error: 'Error al cambiar el estado del rol.' });
    }
}

// Actualizar un rol
async function updateRole(req, res) {
    const { id } = req.params;
    const { nombre_rol, estado_rol, modulos_rol } = req.body;
    try {
        var modulos_string = modulos_rol.join(", ");
        const role = await Roles.findByPk(id);
        await role.update({
            nombre_rol: nombre_rol,
            estado_rol: estado_rol,
            modulos_rol: modulos_string
        })
        res.json(role);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el rol. ' + error});
    }
}

// Exportar las funciones del módulo
module.exports = {
    getAllRoles,
    getRoleById,
    createRole,
    updateRoleStatus,
    updateRole
};
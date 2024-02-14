// pedidosController.js
const Roles = require("../../models/roles");
const Users = require("../../models/users");

// Obtener todos los roles
const getAllRoles = async (req, res) => {
  try {
    const roles = await Roles.findAll();
    if (roles.length === 0) {
      return res.status(404).json({ message: "No hay roles registrados" });
    }
    var roles_list = [];
    for (let role of roles) {
      var id_role = role.id_role;
      var name_role = role.name_role;
      var state_role = role.state_role;
      var modules_string = role.modules_role;
      var modules_array = modules_string.split(", ");
      var role_converted = {
        id_role: id_role,
        name_role: name_role,
        state_role: state_role,
        modules_rol: modules_array,
      };
      roles_list.push(role_converted);
    }
    res.json(roles_list);
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Obtener un rol por ID
async function getRoleById(req, res) {
  const { id } = req.params;
  try {
    var role = await Roles.findByPk(id);
    if (!role) {
      return res.status(404).json({ error: "Rol no encontrado." });
    }
    var id_role = role.id_role;
    var name_role = role.name_role;
    var state_role = role.state_role;
    var modules_string = role.modules_role;
    var observation_status = role.observation_status;
    var modules_array = modules_string.split(", ");
    res.json({
      id_role: id_role,
      name_role: name_role,
      state_role: state_role,
      modules_role: modules_array,
      observation_status: observation_status,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el rol." + error });
  }
}

// Función para validar el nombre del rol en tiempo real
async function validateRoleName(req, res) {
  const { name } = req.params;

  try {
    // Busca un rol con el nombre proporcionado
    const existingRole = await Roles.findOne({
      where: {
        name_role: name,
      },
    });

    if (existingRole) {
      // Si el rol ya existe, responde con un mensaje indicando que el nombre ya está en uso
      return res
        .status(200)
        .json({ message: "El nombre de rol ya está en uso." });
    } else {
      res.status(200).json({ message: "El nombre de rol está disponible." });
    }
    // Si no existe, el nombre de rol está disponible
  } catch (error) {
    // Manejo de errores en la búsqueda del rol
    res
      .status(500)
      .json({ error: "Error al validar el nombre del rol." + error });
  }
}

// Crear un rol
async function createRole(req, res) {
  const { name_role, modules_role, observation_status } = req.body;
  state_role = "Activo";
  modules_string = modules_role.join(", ");
  try {
    const nuevo_rol = await Roles.create({
      name_role: name_role,
      state_role: state_role,
      modules_role: modules_string,
      observation_status: observation_status,
    });
    res.status(201).json({ nuevo_rol });
  } catch (error) {
    res.status(400).json({ error: "Error al crear el rol." });
    console.log(error.message);
  }
}

// Actualizar un rol
async function updateRole(req, res) {
  const { id } = req.params;
  const { name_role, modules_role } = req.body;
  console.log(modules_role);
  try {
    var modules_string = modules_role.join(", ");
    const role = await Roles.findByPk(id);
    await role.update({
      name_role: name_role,
      modules_role: modules_string,
    });
    res.json(role);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el rol. " + error });
  }
}

// Cambiar el estado de un rol
async function updateRoleStatus(req, res) {
  const { id } = req.params;
  const data = req.body;
  try {
    const role = await Roles.findByPk(id);
    var state_role = "";
    if (role.state_role == "Activo") {
      state_role = "Inactivo";
    } else if (role.state_role == "Inactivo") {
      state_role = "Activo";
    }

    if (!role) {
      return res.status(404).json({ error: "Rol no encontrado." });
    }

    // Actualizar el estado del rol
    await role.update({
      state_role: state_role,
      observation_status: data.observation,
    });

    if (role.state_role == "Inactivo") {
      // Buscar todos los usuarios que tengan el id_rol que se está inhabilitando
      const users = await Users.findAll({
        where: {
          id_role: id,
        }
      });
  
      // Cambiar el estado de los usuarios a "Inactivo"
      for (var user of users) {
        await user.update({ state_user: "Inactivo" });
      }
    }

    // Retornar el rol y los usuarios actualizados
    res.json({ role });
  } catch (error) {
    res.status(500).json("Error al cambiar el estado del rol." + error);
  }
}

// Exportar las funciones del módulo
module.exports = {
  getAllRoles,
  getRoleById,
  validateRoleName,
  createRole,
  updateRoleStatus,
  updateRole,
};

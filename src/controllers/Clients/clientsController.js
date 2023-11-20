//Controlador Clientes
const Client = require("../../models/clients");

// Get all clients
const getAllCustomers = async (req, res) => {
  try {
    const clients = await Client.findAll();
    if (clients.length === 0) {
      return res.status(404).json({ message: "No hay clientes registrados" });
    }
    res.json(clients);
  } catch (error) {
    console.error("Error al recuperar clientes: ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Get a client by ID
async function getCustomerById(req, res) {
  const { id } = req.params;
  try {
    const client = await Client.findByPk(id);
    if (!client) {
      return res.status(404).json({ error: "Cliente no encontrado." });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el cliente." });
  }
}

// Función para verificar si el correo es válido
function isValidEmail(email_client) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email_client);
}

// Create a client
async function createCustomer(req, res) {
  const {
    nit_or_id_client,
    name_client,
    last_name_client,
    email_client,
    phone_client,
    address_client,
  } = req.body;

  // Validación: Verifica que los campos obligatorios no estén vacíos
  if (
    !nit_or_id_client ||
    !name_client ||
    !email_client ||
    !address_client ||
    !phone_client ||
    !last_name_client
  ) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  // Validación: Cédula debe ser numérica
  if (!/^\d{10}$/.test(nit_or_id_client)) {
    return res
      .status(400)
      .json({ error: "La cédula debe ser numérica y tener 10 dígitos" });
  }

  // Validación: Nombre debe contener letras, números, espacios y el símbolo "~" para la "ñ"
  if (!/^[A-Za-z0-9\s~ñÑ]+$/.test(name_client)) {
    return res
      .status(400)
      .json({
        error:
          'El nombre debe contener letras, números, espacios y el símbolo "~" para la "ñ"',
      });
  }

  // validacion correo valido
  if (!isValidEmail(email_client)) {
    return res.status(400).json({ error: "El correo no es válido" });
  }

  // Validation: Phone must be numeric
  if (!/^\d{10}$/.test(phone_client)) {
    return res
      .status(400)
      .json({ error: "El teléfono debe ser numérico y tener 10 dígitos" });
  }

  try {
    const newClient = await Client.create({
      nit_or_id_client,
      name_client,
      last_name_client,
      email_client,
      phone_client,
      address_client,
    });

    res.json(newClient);
  } catch (error) {
    console.error("Error al crear el cliente:", error);
    res
      .status(500)
      .json({ error: "Error al crear el cliente. Detalles: " + error.message });
  }
}

async function checkCedulaAvailability(req, res) {
  const { cedula } = req.query;
  try {
    const existingCedula = await Client.findOne({
      where: { nit_or_id_client: cedula },
    });
  } catch (error) {
    console.error("Error al verificar la cédula:", error);
    res.status(500).json({ error: "Error al verificar la cédula." });
  }
}

async function checkEmailAvailability(req, res) {
  const { email_client } = req.query;
  try {
    const existingEmail = await Client.findOne({ where: { email_client } });
    res.json(!existingEmail);
  } catch (error) {
    console.error("Error al verificar el correo:", error);
    res.status(500).json({ error: "Error al verificar el correo." });
  }
}

// Update client
const customerPut = async (req, res) => {
  const { id } = req.params;
  const {
    nit_or_id_client,
    name_client,
    last_name_client,
    email_client,
    phone_client,
    address_client,
    state_client,
  } = req.body;
  let message = "";

  try {
    if (id) {
      const client = await Client.findByPk(id);

      if (client) {
        client.nit_or_id_client = nit_or_id_client;
        client.name_client = name_client;
        client.last_name_client = last_name_client;
        client.email_client = email_client;
        client.phone_client = phone_client;
        client.address_client = address_client;
        client.state_client = state_client;

        await client.save();

        message = "La modificación se efectuó correctamente";
      } else {
        message = "El cliente no fue encontrado";
      }
    } else {
      message = "Falta el ID en la solicitud";
    }
  } catch (error) {
    console.error(error);
    message = "Ocurrió un error al actualizar el cliente: " + error.message;
  }

  res.json({
    msg: message,
  });
};

// Delete client
const customerDelete = async (req, res) => {
  const { id } = req.params;
  let message = "";

  try {
    if (id) {
      const client = await Client.findByPk(id);

      if (client) {
        await client.destroy();

        message = "La eliminación se efectuó exitosamente.";
      } else {
        message = "El cliente no fue encontrado.";
      }
    } else {
      message = "Falta el ID en la solicitud";
    }
  } catch (error) {
    console.error(error);
    message = "Ocurrió un error al eliminar el cliente: " + error.message;
  }

  res.json({
    msg: message,
  });
};


// Cambiar estado del cliente
async function CustomerChangeStatus(req, res) {
  const { id } = req.params;

  let mensaje = "";

  try {
    if (id) {
      // Buscar el cliente por su ID
      const client = await Client.findByPk(id);

      if (client) {
        var state_client_new = "";

        if (client.state_client === "Activo") {
          state_client_new = "Inactivo";
        } else if (client.state_client === "Inactivo") {
          state_client_new = "Activo";
        }

        // Actualizar el estado del empleado
        client.state_client = state_client_new;

        // Guardar los cambios en la base de datos
        await client.save();

        mensaje = "Cambio de estado realizado con éxito.";
      } else {
        mensaje = "El cliente no fue encontrado.";
      }
    } else {
      mensaje = "Falta el ID en la solicitud.";
    }
  } catch (error) {
    console.error("Error al cambiar el estado del cliente:", error);
    mensaje = "Fallo al realizar el cambio de estado: " + error.message;
  }

  res.json({
    msg: mensaje,
  });
}

// Export controller
module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  customerPut,
  customerDelete,
  CustomerChangeStatus,
  checkCedulaAvailability,
  checkEmailAvailability,
};

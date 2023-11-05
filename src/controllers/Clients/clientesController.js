//Controlador Clientes
const Client = require('../../models/clients');

// Get all clients
const getAllCustomers = async (req, res) => {
    try {
        const clients = await Client.findAll();
        if (clients.length === 0) {
            return res.status(404).json({ message: "No hay clientes registrados" });
        }
        res.json(clients);
    } catch (error) {
        console.error('Error al recuperar clientes: ', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Get a client by ID
async function getCustomerById(req, res) {
    const { id } = req.params;
    try {
        const client = await Client.findByPk(id);
        if (!client) {
            return res.status(404).json({ error: 'Cliente no encontrado.' });
        }
        res.json(client);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el cliente.' });
    }
}

// Función para verificar si el correo es válido
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Create a client
async function createCustomer(req, res) {
    const { nit_or_id_client, name_client, last_name_client, email_client, phone_client, address_client, state_client } = req.body;

    // Validation: Check for empty required fields
    if (!nit_or_id_client || !name_client || !email_client || !address_client || !phone_client) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Validation: ID must be numeric
    if (!/^\d{10}$/.test(nit_or_id_client)) {
        return res.status(400).json({ error: 'El ID debe ser numérico y tener 10 dígitos' });
    }

    // Validation: Name must contain letters
    if (!/^[a-zA-Z]+$/.test(name_client)) {
        return res.status(400).json({ error: 'El nombre debe contener solo letras.' });
    }

    // Validation: Email must be valid
    if (!isValidEmail(email_client)) {
        return res.status(400).json({ error: 'El correo no es válido' });
    }

    // Validation: Phone must be numeric
    if (!/^\d{10}$/.test(phone_client)) {
        return res.status(400).json({ error: 'El teléfono debe ser numérico y tener 10 dígitos' });
    }

    // Validation: `nit_or_id_client` must be unique
    const existingClient = await Client.findOne({ where: { nit_or_id_client } });

    if (existingClient) {
        return res.status(400).json({ error: "El ID ya está en uso." });
    }

    // Validation: `email_client` must be unique
    const existingEmail = await Client.findOne({ where: { email_client } });

    if (existingEmail) {
        return res.status(400).json({ error: "El correo ya está en uso." });
    }

    // Validation: `state_client` must be a valid value
    if (!['activo', 'inactivo'].includes(state_client)) {
        return res.status(400).json({ error: 'El estado del cliente debe ser "activo" o "inactivo".' });
    }

    try {
        const newClient = await Client.create({
            nit_or_id_client,
            name_client,
            last_name_client,
            email_client,
            phone_client,
            address_client,
            state_client,
        });

        res.json(newClient);
    } catch (error) {
        console.error('Error al crear el cliente:', error);
        res.status(500).json({ error: 'Error al crear el cliente. Detalles: ' + error.message });
    }
}

// Update client
const customerPut = async (req, res) => {
    const { id } = req.params;
    const { nit_or_id_client, name_client, last_name_client, email_client, phone_client, address_client, state_client } = req.body;
    let message = '';

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
        msg: message
    });
};

// Delete client
const customerDelete = async (req, res) => {
    const { id } = req.params;
    let message = '';

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
        msg: message
    });
};

// Change client status
const CustomerChangeStatus = async (req, res) => {
    const { id } = req.params;
    const { newStatus } = req.body;
    let message = '';

    try {
        if (id && newStatus) {
            const client = await Client.findByPk(id);

            if (client) {
                client.state_client = newStatus;
                await client.save();

                message = "El estado del cliente se actualizó exitosamente.";
            } else {
                message = "El cliente no fue encontrado";
            }
        } else {
            message = "Falta el ID o el nuevo estado en la solicitud";
        }
    } catch (error) {
        console.error(error);
        message = "Ocurrió un error al cambiar el estado del cliente: " + error.message;
    }

    res.json({
        msg: message
    });
};

// Export controller
module.exports = {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    customerPut,
    customerDelete,
    CustomerChangeStatus
};

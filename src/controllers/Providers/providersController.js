// proveedoresController.js
const Providers = require('../../models/providers');
const { Op } = require('sequelize');


// Obtener todos los proveedores
const getAllProv = async (req, res) => {
    try {
        const providers = await Providers.findAll();
        if (providers.length === 0) {
            return res.status(404).json({ message: "No hay proveedores registrados" })
        }
        res.json(providers);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Obtener un proveedor por ID
async function getProvById(req, res) {
    const { id } = req.params;
    try {
        const provider = await Providers.findByPk(id);
        if (!provider) {
            return res.status(404).json({ error: 'Proveedor no encontrado.' });
        }
        const {
            name_provider,
            nit_cedula,
            email_provider,
            address_provider,
            phone_provider,
            state_provider,
            observation_provider,
            name_contact,
            creation_date_provider,
            reason_anulate
        } = provider;

        res.json({
            name_provider,
            nit_cedula,
            email_provider,
            address_provider,
            phone_provider,
            state_provider,
            observation_provider,
            name_contact,
            creation_date_provider,
            reason_anulate
        });
    } catch (error) {
        console.error('Error al obtener el proveedor:', error);
        res.status(500).json({ error: 'Error al obtener el proveedor.' });
    }
}
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
// Función para crear un proveedor
async function createProv(req, res) {
    const {
        nit_cedula,
        name_provider,
        email_provider,
        address_provider,
        phone_provider,
        observation_provider,
        name_contact,
    } = req.body;

    try {
        // Validar que los campos requeridos no estén vacíos
        if (!nit_cedula || !name_provider || !email_provider || !address_provider || !phone_provider || !name_contact) {
            return res.status(400).json({ error: 'Todos los campos requeridos deben estar presentes.' });
        }
        if (!/^\d{7,10}$/.test(nit_cedula)) {
            return res.status(400).json({ error: 'La cédula debe ser un número positivo y tener entre 7 y 10 dígitos' });
        }
        // Validación: Nombre debe contener letras, números, espacios y el símbolo "~" para la "ñ"
        if (!/^[A-Za-z0-9\s~ñÑ]+$/.test(name_contact)) {
            return res.status(400).json({ error: 'El nombre debe contener letras, números, espacios y el símbolo "~" para la "ñ"' });
        }

        // Validación: Correo debe ser válido
        if (!isValidEmail(email_provider)) {
            return res.status(400).json({ error: 'El correo no es válido' });
        }

        // Validación: Teléfono debe ser numérico
        if (!/^[0-9+ ]+$/.test(phone_provider)) {
            return res.status(400).json({ error: 'El teléfono debe contener solo números, el símbolo + y espacios.' });
        }



        // Validar la unicidad de campos únicos
        const providerExist = await Providers.findOne({
            where: {
                [Op.or]: [
                    { email_provider },
                    { name_provider },
                    { nit_cedula },
                    { address_provider },
                    { name_contact },
                    { phone_provider },
                ],
            },
        });

        if (providerExist) {
            return res.status(400).json({ error: 'El proveedor con estos datos ya existe.' });
        }
        const newProvider = await Providers.create({
            nit_cedula,
            name_provider,
            email_provider,
            address_provider,
            phone_provider,
            observation_provider,
            name_contact,
        });

        // Si se creó con éxito, devuelve una respuesta con el proveedor creado
        res.status(201).json(newProvider);
    } catch (error) {
        // En caso de error, devuelve un mensaje de error
        res.status(400).json({ error: 'Error al crear el proveedor.' });
        console.log(error.message);
    }
}

// Función para actualizar un proveedor por ID
async function updateProv(req, res) {
    const { id } = req.params;
    const updatedData = req.body;
    console.log(updatedData)
    try {
        const provider = await Providers.findByPk(id);

        if (!provider) {
            return res.status(404).json({ error: 'Proveedor no encontrado.' });
        }

        // Verificar y actualizar solo las propiedades que han cambiado
        if (updatedData.name_provider !== undefined) {
            provider.name_provider = updatedData.name_provider;
        }

        if (updatedData.nit_cedula !== undefined) {
            console.log(updatedData.nit_cedula)
            if (!/^\d{7,10}$/.test(updatedData.nit_cedula)) {
                return res.status(400).json({ error: 'La cédula debe ser un número positivo y tener entre 7 y 10 dígitos' });
            }
            provider.nit_cedula = updatedData.nit_cedula;
        }

        if (updatedData.email_provider !== undefined) {
            if (!isValidEmail(updatedData.email_provider)) {
                return res.status(400).json({ error: 'El correo no es válido' });
            }
            provider.email_provider = updatedData.email_provider;
        }

        if (updatedData.address_provider !== undefined) {
            provider.address_provider = updatedData.address_provider;
        }

        if (updatedData.phone_provider !== undefined) {
            if (!/^[0-9+ ]+$/.test(updatedData.phone_provider)) {
                return res.status(400).json({ error: 'El teléfono debe contener solo números, el símbolo + y espacios.' });
            }
            provider.phone_provider = updatedData.phone_provider;
        }
        if (updatedData.observation_provider !== undefined) {
            provider.observation_provider = updatedData.observation_provider;
        }
        if (updatedData.name_contact !== undefined) {
            if (!/^[A-Za-z0-9\s~ñÑ]+$/.test(updatedData.name_contact)) {
                return res.status(400).json({ error: 'El nombre debe contener letras, números, espacios y el símbolo "~" para la "ñ"' });
            }
            provider.name_contact = updatedData.name_contact;
        }

        // Guardar el proveedor actualizado
        await provider.save();

        res.json(provider);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            // Si el error es una violación de restricción de unicidad
            return res.status(400).json({ error: error.name });
        } else {
            res.status(500).json({ error: error });
            console.log(error.message);
        }
    }
}


async function updateState(req, res) {
    const { id } = req.params;
    const { reason_anulate } = req.body; // Cambia a la clave correcta que estás enviando desde el frontend
    console.log("id", id, "reason_anulate", reason_anulate);
    try {
        const provider = await Providers.findByPk(id);

        if (!provider) {
            return res.status(404).json({ error: 'Proveedor no encontrado.' });
        }

        if (provider.state_provider === 'Activo') {
            provider.state_provider = 'Inactivo';
        } else if (provider.state_provider === 'Inactivo') {
            provider.state_provider = 'Activo';
        }

        provider.reason_anulate = reason_anulate;

        await provider.save();
        console.log("estado", provider.reason_anulate)
        res.json(provider);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el estado del proveedor.' });
        console.log(error.message);
    }
}


async function checkCedulaAvailability(req, res) {
    const { cedula } = req.query;
    try {
        const existingCedula = await Providers.findOne({ where: { nit_cedula: cedula } });
        res.json(!existingCedula);
    } catch (error) {
        console.log(cedula)
        console.error('Error al verificar la cédula:', error);
        res.status(500).json({ error: 'Error al verificar la cédula.', details: error.message });
    }
}

async function checkEmailAvailability(req, res) {
    const { email } = req.query;
    try {
        const existingEmail = await Providers.findOne({ where: { email } });
        res.json(!existingEmail);
    } catch (error) {
        console.error('Error al verificar el correo:', error);
        res.status(500).json({ error: 'Error al verificar el correo.' });
    }
}

// Exportar las funciones del módulo

module.exports = {
    getAllProv,
    getProvById,
    createProv,
    updateProv,
    updateState,
    checkCedulaAvailability,
    checkEmailAvailability
};

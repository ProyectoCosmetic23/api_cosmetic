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
        if (!/^[A-Za-z0-9\sáéíóúÁÉÍÓÚüÜñÑ~]+$/.test(name_contact)) {
            return res.status(400).json({ error: 'El nombre del contacto debe contener letras, números, espacios y el símbolo "~" para la "ñ"' });
        } else if (name_contact.length < 3 || name_contact.length > 50) {
            return res.status(400).json({ error: 'El nombre del contacto debe tener entre 3 y 50 caracteres.' });
        }

        // Validación: Correo debe ser válido
        if (!isValidEmail(email_provider)) {
            return res.status(400).json({ error: 'El correo no es válido' });
        } else if (email_provider.length > 80) {
            return res.status(400).json({ error: 'El correo electrónico no puede superar los 80 caracteres.' });
        }


        // Validación: Teléfono debe ser numérico
        if (!/^\d{7,10}$/.test(phone_provider)) {
            return res.status(400).json({ error: 'El teléfono debe un número entre 7 y 10 dígitos.' });
        }

        if (!/^[A-Za-záéíóúÁÉÍÓÚüÜñÑ\s&\-\'0-9.!]+$/.test(name_provider)) {
            return res.status(400).json({ error: 'El nombre del proveedor debe contener letras, números, espacios y los símbolos: ., \', -, &, y !' });
        } else if (name_provider.length < 5 || name_provider.length > 50) {
            return res.status(400).json({ error: 'El nombre del proveedor debe tener entre 5 y 50 caracteres.' });
        }

        if (observation_provider.length > 100) {
            return res.status(400).json({ error: 'La observación no puede pasar los 100 caracteres' });
        }
        if (address_provider.length > 80 || address_provider.length < 4) {
            return res.status(400).json({ error: 'La dirección debe tener entre 4 y 80 caracteres' });
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
            if (!/^[A-Za-záéíóúÁÉÍÓÚüÜñÑ\s&\-\'0-9.!]+$/.test(updatedData.name_provider)) {
                return res.status(400).json({ error: 'El nombre del proveedor debe contener letras, números, espacios y los símbolos: ., \', -, &, y !' });
            } else if (updatedData.name_provider.length < 5 || updatedData.name_provider.length > 50) {
                return res.status(400).json({ error: 'El nombre del proveedor debe tener entre 5 y 50 caracteres.' });
            }
            
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
            } else if (updatedData.email_provider.length > 80) {
                return res.status(400).json({ error: 'El correo electrónico no puede superar los 80 caracteres.' });
            }
            provider.email_provider = updatedData.email_provider;
        }

        if (updatedData.address_provider !== undefined) {
            if (updatedData.address_provider.length > 80 || updatedData.address_provider.length < 4) {
                return res.status(400).json({ error: 'La dirección debe tener entre 4 y 80 caracteres' });
            }    
            provider.address_provider = updatedData.address_provider;
        }

        

        if (updatedData.phone_provider !== undefined) {
            if (!/^\d{7,10}$/.test(updatedData.phone_provider)) {
                return res.status(400).json({ error: 'El teléfono debe un número entre 7 y 10 dígitos.' });
            }
            provider.phone_provider = updatedData.phone_provider;
        }
        if (updatedData.observation_provider !== undefined) {
            if (updatedData.observation_provider.length > 100) {
                return res.status(400).json({ error: 'La observación no puede pasar los 100 caracteres' });
            }
            provider.observation_provider = updatedData.observation_provider;
        }

        if (updatedData.name_contact !== undefined) {
            if (!/^[A-Za-z0-9\sáéíóúÁÉÍÓÚüÜñÑ~]+$/.test(updatedData.name_contact)) {
                return res.status(400).json({ error: 'El nombre del contacto debe contener letras, números, espacios y el símbolo "~" para la "ñ"' });
            } else if (updatedData.name_contact.length < 3 || updatedData.name_contact.length > 50) {
                return res.status(400).json({ error: 'El nombre del contacto debe tener entre 3 y 50 caracteres.' });
            }
            provider.name_contact = updatedData.name_contact;
        }

        // Guardar el proveedor actualizado
        await provider.save();

        res.json(provider);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            // Si el error es una violación de restricción de unicidad
            return res.status(400).json({ error: "Ya existe un proveedor con estos datos" });
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

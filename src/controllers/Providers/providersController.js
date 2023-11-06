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
        res.json({ provider });
    } catch (error) {
        console.error('Error al obtener el proveedor:', error);
        res.status(500).json({ error: 'Error al obtener el proveedor.' });
    }
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
        creation_date_provider,
    } = req.body;

    try {
        // Validar que los campos requeridos no estén vacíos
        if (!nit_cedula || !name_provider || !email_provider || !address_provider || !phone_provider || !name_contact || !creation_date_provider) {
            return res.status(400).json({ error: 'Todos los campos requeridos deben estar presentes.' });
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
            creation_date_provider,
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
    const updatedData =
        {
            name_provider,
            email_provider,
            address_provider,
            phone_provider,
            state_provider,
            observation_provider,
            name_contact,
            state_provider,
        } = req.body;

    try {
        const provider = await Providers.findByPk(id);

        if (!provider) {
            return res.status(404).json({ error: 'Proveedor no encontrado.' });
        }
        const providerExist = await Providers.findOne({
            where: {
                [Op.or]: [
                    { email_provider },
                    { name_provider },
                    { address_provider },
                    { name_contact },
                    { phone_provider },
                ],
            },
        });

        if (providerExist) {
            return res.status(400).json({ error: 'El proveedor con estos datos ya existe.' });
        }

        await provider.update(updatedData);

        res.json(provider);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el proveedor.' });
        console.log(error.message);
    }
}

async function updateState(req, res) {
    const { id } = req.params;

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

        await provider.save();

        res.json(proveedor);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el estado del proveedor.' });
        console.log(error.message);
    }
}

// Exportar las funciones del módulo

module.exports = {
    getAllProv,
    getProvById,
    createProv,
    updateProv,
    updateState,
};

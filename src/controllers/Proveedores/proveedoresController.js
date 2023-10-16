// proveedoresController.js
const Proveedores = require('../../models/proveedores');


// Obtener todos los proveedores
const getAllProv = async (req, res) => {
    try {
        const proveedores = await Proveedores.findAll();
        if (proveedores.length === 0) {
            return res.status(404).json({ message: "No hay proveedores registrados" })
        }
        res.json(proveedores);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Obtener un proveedor por ID
async function getProvById(req, res) {
    const { id } = req.params;
    try {
        const proveedores = await Proveedores.findByPk(id);
        if (!proveedores) {
            return res.status(404).json({ error: 'Proveedor no encontrado.' });
        }
        res.json({ proveedores });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el proveedor.' });
    }
}

// Función para crear un proveedor
async function createProv(req, res) {
    const {
        nit_cedula,
        nombre_proveedor,
        correo_proveedor,
        direccion_proveedor,
        telefono_proveedor,
        observacion_proveedor,
        nombre_contacto,
        fecha_creacion_proveedor,
    } = req.body;

    try {
        // Crea un nuevo proveedor con los datos proporcionados
        const nuevoProveedor = await Proveedores.create({
            nit_cedula,
            nombre_proveedor,
            correo_proveedor,
            direccion_proveedor,
            telefono_proveedor,
            observacion_proveedor,
            nombre_contacto,
            fecha_creacion_proveedor,
        });

        // Si se creó con éxito, devuelve una respuesta con el proveedor creado
        res.status(201).json(nuevoProveedor);
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
            nombre_proveedor,
            correo_proveedor,
            direccion_proveedor,
            telefono_proveedor,
            estado_proveedor,
            observacion_proveedor,
            nombre_contacto,
        } = req.body;

    try {
        const proveedor = await Proveedores.findByPk(id);

        if (!proveedor) {
            return res.status(404).json({ error: 'Proveedor no encontrado.' });
        }


        await proveedor.update(updatedData);

        res.json(proveedor);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el proveedor.' });
        console.log(error.message);
    }
}

async function updateEstado(req, res) {
    const { id } = req.params;

    try {
        const proveedor = await Proveedores.findByPk(id);

        if (!proveedor) {
            return res.status(404).json({ error: 'Proveedor no encontrado.' });
        }

        if (proveedor.estado_proveedor === 'Activo') {
            proveedor.estado_proveedor = 'Inactivo';
        } else if (proveedor.estado_proveedor === 'Inactivo') {
            proveedor.estado_proveedor = 'Activo';
        }

        await proveedor.save();

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
    updateEstado,
};

const Comisiones = require('../../models/comisiones');


// Obtener todos las comisiones
const getAllComs = async (req, res) => {
    try {
        const comisiones = await Comisiones.findAll();
        if (comisiones.length === 0) {
            return res.status(404).json({ message: "No hay comisiones registradas" })
        }
        res.json(comisiones);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Obtener una comision por ID
async function getComsById(req, res) {
    const { id } = req.params;
    try {
        const comisiones = await Comisiones.findByPk(id);
        if (!comisiones) {
            return res.status(404).json({ error: 'Comisión no encontrada.' });
        }
        res.json({ comisiones });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la comisión.' });
    }
}
// Función para crear una comision
async function createComs(req, res) {
    const {
        id_empleado,
        id_venta,
        fecha_comision,
        porcentaje_comision,
        total_comision,
        observacion_comision,
    } = req.body;

    try {
        // Crea una comision con los datos proporcionados
        const nuevaComision = await Comisiones.create({
            id_empleado,
            id_venta,
            fecha_comision,
            porcentaje_comision,
            total_comision,
            observacion_comision,
        });

        res.status(201).json(nuevaComision);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el proveedor.' });
        console.log(error.message);
    }
}

async function updateComs(req, res) {
    
}

async function updateEstado(req, res) {
    const { id } = req.params;

    try {
        const comision = await Comisiones.findByPk(id);

        if (!comision) {
            return res.status(404).json({ error: 'comision no encontrada.' });
        }

        if (comision.estado_comision === 'Activo') {
            comision.estado_comision = 'Inactivo';
        } else if (comision.estado_comision === 'Inactivo') {
            comision.estado_comision = 'Activo';
        }

        await comision.save();

        res.json(comision);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el estado de la comision.' });
        console.log(error.message);
    }
}

module.exports = {
    getAllComs,
    getComsById,
    createComs,
    updateEstado,
};

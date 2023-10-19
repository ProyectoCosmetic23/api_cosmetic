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
//Obtener comision por id de empleado
async function getComsEmpleado(req, res) {
    const id_empleado = req.params.id;

    try {
        const comsEmpleado = await Comisiones.findAll({
            where: { id_empleado },
        });

        if (comsEmpleado.length === 0) {
            return res.status(404).json({ message: "No hay comisiones para este empleado" })
        }
        res.json(comsEmpleado);
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
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
        total_comision,
        id_detalle_comision,
    } = req.body;

    try {
        // Crea una comision con los datos proporcionados
        const nuevaComision = await Comisiones.create({
            id_empleado,
            total_comision,
            id_detalle_comision,
        });

        res.status(201).json(nuevaComision);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el proveedor.' });
        console.log(error.message);
    }
}

module.exports = {
    getAllComs,
    getComsById,
    createComs,
    getComsEmpleado,
};

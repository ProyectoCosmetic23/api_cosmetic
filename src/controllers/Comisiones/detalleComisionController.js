const Detalle_Comision = require('../../models/detalle_comision');


// Obtener todos las comisiones
const getAllDetalles = async (req, res) => {
    try {
        const detalle_comision = await Detalle_Comision.findAll();
        if (detalle_comision.length === 0) {
            return res.status(404).json({ message: "No hay comisiones registradas para este mes" })
        }
        res.json(detalle_comision);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Obtener una comision por ID
async function getDetallComsById(req, res) {
    const { id } = req.params;
    try {
        const detalle_comision = await Detalle_Comision.findByPk(id);
        if (!detalle_comision) {
            return res.status(404).json({ error: 'Comisión no encontrada.' });
        }
        res.json({ detalle_comision });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la comisión.' });
    }
}
//Crear un detalle de comision
// Crear un detalle de comisión
async function createDetalleCom(req, res) {
    const { porcentaje_comision } = req.body;

    try {
        const fecha_actual = new Date(); 
        const mes_comision = new Date(fecha_actual.getFullYear(), fecha_actual.getMonth(), 1);

        // Verificar si ya existe una comisión para este mes
        const comisionExistente = await Detalle_Comision.findOne({
            where: { mes_comision }
        });

        if (comisionExistente) {
            return res.status(400).json({ error: 'Ya existe una comisión registrada para este mes.' });
        }

        const nuevoDetalleComision = await Detalle_Comision.create({
            mes_comision,
            porcentaje_comision,
        });

        res.status(201).json(nuevoDetalleComision);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear la comisión.' });
        console.log(error.message);
    }
}



module.exports = {
    getAllDetalles,
    getDetallComsById,
    createDetalleCom,
};

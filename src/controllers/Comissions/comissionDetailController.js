const Comission_Detail = require('../../models/commission_detail');
const Comision_Detail = require('../../models/commission_detail');


// Obtener todos las comisiones
const getAllDetails = async (req, res) => {
    try {
        const commission_detail = await Comision_Detail.findAll();
        if (commission_detail.length === 0) {
            return res.status(404).json({ message: "No hay comisiones registradas para este mes" })
        }
        res.json(commission_detail);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Obtener una comision por ID
async function getDetailComsById(req, res) {
    const { id } = req.params;
    try {
        const commission_detail = await Comision_Detail.findByPk(id);
        if (!commission_detail) {
            return res.status(404).json({ error: 'Comisión no encontrada.' });
        }
        res.json({ commission_detail });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la comisión.' });
    }
}
// Crear un detalle de comisión
async function createDetaileCom(req, res) {
    const { commission_percentage } = req.body;

    try {
        const actual_date = new Date();
        const month_commission = new Date(actual_date.getFullYear(), actual_date.getMonth(), 1);

        // Verificar si ya existe una comisión para este mes
        const comisionExist = await Comission_Detail.findOne({
            where: { month_commission }
        });

        if (comisionExist) {
            return res.status(400).json({ error: 'Ya existe una comisión registrada para este mes.' });
        }

        const nuevoDetaileComision = await Comission_Detail.create({
            month_commission,
            commission_percentage,
        });

        res.status(201).json(nuevoDetaileComision);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear la comisión.' });
        console.log(error.message);
    }
}



module.exports = {
    getAllDetails,
    getDetailComsById,
    createDetaileCom,
};

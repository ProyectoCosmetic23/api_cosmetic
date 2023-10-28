const Comisiones = require('../../models/comisiones');
const Detalle_Comision = require('../../models/detalle_comision');
const Ventas = require('../../models/ventas');
const { Op } = require('sequelize'); // Importa Sequelize.Op para los operadores

async function createComs(req, res) {
    const {
        id_empleado,
        id_detalle_comision,
    } = req.body;

    try {
        // Obtener el detalle de comisión para el mes correspondiente
        const detalleComision = await Detalle_Comision.findByPk(id_detalle_comision);
        
        if (!detalleComision) {
            return res.status(400).json({ error: 'Detalle de comisión no encontrado.' });
        }
        
        const comisionExistente = await Comisiones.findOne({
            where: {
                id_empleado,
                id_detalle_comision,
            }
        });

        if (comisionExistente) {
            return res.status(400).json({ error: 'Ya existe una comisión registrada para este empleado en el mismo mes.' });
        }

        // Obtener el primer y último día del mes del detalle de comisión
        const primerDiaMes = new Date(detalleComision.mes_comision);
        const ultimoDiaMes = new Date(detalleComision.mes_comision);
        ultimoDiaMes.setMonth(ultimoDiaMes.getMonth() + 1);
        ultimoDiaMes.setDate(0);

        // Ajustar las fechas para comparar solo hasta el día (sin hora)
        primerDiaMes.setHours(0, 0, 0, 0);
        ultimoDiaMes.setHours(23, 59, 59, 999);

        // Calcular el total de ventas del empleado durante ese mes
        let ventasEmpleado = await Ventas.sum('total_venta', {
            where: {
                id_empleado,
                fecha_venta: {
                    [Op.gte]: primerDiaMes,
                    [Op.lte]: ultimoDiaMes,
                },
            },
        });

        if (ventasEmpleado === null) {
            ventasEmpleado = 0; // Si no hay ventas, establece el total en 0
        }

        // Calcular la comisión multiplicando las ventas por el porcentaje
        const total_comision = (ventasEmpleado * detalleComision.porcentaje_comision) / 100;

        // Crea una comisión con los datos calculados
        const nuevaComision = await Comisiones.create({
            id_empleado,
            total_comision,
            id_detalle_comision,
        });

        res.status(201).json(nuevaComision);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear la comisión.' });
        console.log(error.message);
    }
}



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

module.exports = {
    getAllComs,
    getComsById,
    createComs,
    getComsEmpleado,
};

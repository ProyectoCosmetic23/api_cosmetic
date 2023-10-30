const Comissions = require('../../models/commissions');
const Comission_Detail = require('../../models/commission_detail');
const Sales = require('../../models/sales');
const { Op } = require('sequelize'); // Importa Sequelize.Op para los operadores


async function createComs(req, res) {
    const {
        id_employee,
        id_commission_detail,
    } = req.body;

    try {
        // Obtener el detalle de comisión para el mes correspondiente
        const comissionDetail = await Comission_Detail.findByPk(id_commission_detail);
        
        if (!comissionDetail) {
            return res.status(400).json({ error: 'Detalle de comisión no encontrado.' });
        }
        
        const comissionExist = await Comissions.findOne({
            where: {
                id_employee,
                id_commission_detail,
            }
        });

        if (comissionExist) {
            return res.status(400).json({ error: 'Ya existe una comisión registrada para este empleado en el mismo mes.' });
        }

        // Obtener el primer y último día del mes del detalle de comisión
        const firstDayMonth = new Date(comissionDetail.month_commission);
        const lastDayMonth = new Date(comissionDetail.month_commission);
        lastDayMonth.setMonth(lastDayMonth.getMonth() + 1);
        lastDayMonth.setDate(0);

        // Ajustar las fechas para comparar solo hasta el día (sin hora)
        firstDayMonth.setHours(0, 0, 0, 0);
        lastDayMonth.setHours(23, 59, 59, 999);

        // Calcular el total de ventas del empleado durante ese mes
        let employeeSales = await Sales.sum('total_sale', {
            where: {
                id_employee,
                sale_date: {
                    [Op.gte]: firstDayMonth,
                    [Op.lte]: lastDayMonth,
                },
            },
        });

        if (employeeSales === null) {
            employeeSales = 0; // Si no hay ventas, establece el total en 0
        }

        // Calcular la comisión multiplicando las ventas por el porcentaje
        const total_commission = (employeeSales * comissionDetail.commission_percentage) / 100;

        // Crea una comisión con los datos calculados
        const newComs = await Comissions.create({
            id_employee,
            total_commission,
            id_commission_detail,
        });

        res.status(201).json(newComs);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear la comisión.' });
        console.log(error.message);
    }
}



// Obtener todos las comisiones
const getAllComs = async (req, res) => {
    try {
        const comissions = await Comissions.findAll();
        if (comissions.length === 0) {
            return res.status(404).json({ message: "No hay comisiones registradas" })
        }
        res.json(comissions);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
//Obtener comision por id de empleado
async function getComsEmploy(req, res) {
    const id_employee = req.params.id;

    try {
        const comsEmployee = await Comissions.findAll({
            where: { id_employee },
        });

        if (comsEmployee.length === 0) {
            return res.status(404).json({ message: "No hay comisiones para este empleado" })
        }
        res.json(comsEmployee);
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
// Obtener una comision por ID
async function getComsById(req, res) {
    const { id } = req.params;
    try {
        const comissions = await Comissions.findByPk(id);
        if (!comissions) {
            return res.status(404).json({ error: 'Comisión no encontrada.' });
        }
        res.json({ comissions });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la comisión.' });
    }
}

// Función para crear una comision

module.exports = {
    getAllComs,
    getComsById,
    createComs,
    getComsEmploy,
};

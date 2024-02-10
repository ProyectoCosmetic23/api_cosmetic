const { Op } = require('sequelize');
const Comission_Detail = require('../../models/commission_detail');
const Comissions = require('../../models/commissions');
const Orders = require('../../models/orders');
const Employee = require('../../models/employees');

async function createComs(req, res) {
    const {
        id_employee,
        id_commission_detail,
    } = req.body;

    try {
        if (id_employee === undefined || id_employee === null || id_commission_detail === undefined || id_commission_detail === null) {
            return res.status(400).json({ error: 'Complete los campos obligatorios.' });
        }
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
        let employeeSales = await Orders.sum('total_order', {
            where: {
                id_employee,
                order_date: {
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
            total_sales: employeeSales, // Asignar el valor de total_sales
        });

        res.status(201).json(newComs);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear la comisión.' });
        console.log(error.message);
    }
}





// Obtener todos las comisiones
async function getAllComs(req, res) {
    try {
        const comissions = await Comissions.findAll();
        if (comissions.length === 0) {
            return res.status(404).json({ message: "No hay comisiones registradas" });
        }

        // Itera a través de las comisiones y agrega el nombre del empleado
        for (const comission of comissions) {
            const employee = await Employee.findByPk(comission.id_employee);
            comission.employee_name = employee ? employee.name_employee : '';
        }

        res.json(comissions);

    } catch (error) {
        console.error('Error fetching comissions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

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
async function getComsDetailId(req, res) {
    const id_commission_detail = req.params.id;

    try {
        const comsDetailComs = await Comissions.findAll({
            where: { id_commission_detail },
        });

        if (comsDetailComs.length === 0) {
            return res.status(404).json({ message: "No hay comisiones para este detalle" })
        }
        res.json(comsDetailComs);
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

async function getSalesByEmployeeAndMonth(req, res) {
    console.log('actualizar comision llamada');
    const { id_employee, month } = req.params;
    try {
        // Obtener el primer y último día del mes
        const firstDayMonth = new Date(month);
        const lastDayMonth = new Date(month);
        lastDayMonth.setMonth(lastDayMonth.getMonth() + 1);
        lastDayMonth.setDate(0);

        // Ajustar las fechas para comparar solo hasta el día (sin hora)
        firstDayMonth.setHours(0, 0, 0, 0);
        lastDayMonth.setHours(23, 59, 59, 999);

        // Obtener las ventas del empleado para el mes dado
        const employeeSales = await Orders.findAll({
            attributes: ['total_order'],
            where: {
                id_employee,
                order_date: {
                    [Op.gte]: firstDayMonth,
                    [Op.lte]: lastDayMonth,
                },
            },
        });

        res.json(employeeSales);
    } catch (error) {
        console.error('Error fetching sales:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


const updateComissionsFromSales = async (month) => {
    try {
        const adjustedMonth = `${new Date(month).getFullYear()}-${('0' + (new Date(month).getMonth() + 1)).slice(-2)}-01`;
        console.log(adjustedMonth);
        const comissions = await Comissions.findAll({
            include: [
                {
                    model: Comission_Detail,
                    attributes: ['month_commission', 'commission_percentage'],
                    where: {
                        month_commission: adjustedMonth,
                    },
                },
            ],
        });

        for (const comission of comissions) {
            const { id_employee, commission_detail } = comission;

            // Obtener ventas para este empleado y mes
            const employeeSales = await Orders.sum('total_order', {
                where: {
                    id_employee,
                    order_date: {
                        [Op.gte]: new Date(commission_detail.month_commission),
                    },
                },
            });

            // Actualizar la comisión con las nuevas ventas
            await comission.update({
                total_sales: employeeSales || 0,
                total_commission: (employeeSales * commission_detail.commission_percentage) / 100,
            });
        }
        await t.commit();
        console.log('Comisiones actualizadas correctamente.');
    } catch (error) {
        console.error('Error al actualizar comisiones:', error);
    }
};


module.exports = {
    getAllComs,
    getComsById,
    createComs,
    getComsEmploy,
    getComsDetailId,
    getSalesByEmployeeAndMonth,
    updateComissionsFromSales
};

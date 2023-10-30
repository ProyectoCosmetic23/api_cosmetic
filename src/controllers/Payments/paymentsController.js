const Payments = require('../../models/payments');
const Sales = require('../../models/sales');


// Obtener todos los pagos
const getAllPay = async (req, res) => {
    try {
        const payments = await Payments.findAll();
        if (payments.length === 0) {
            return res.status(404).json({ message: "No hay pagos" })
        }
        res.json(payments);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Obtener un pago por ID
async function getPayById(req, res) {
    const { id } = req.params;
    try {
        const payments = await Payments.findByPk(id);
        if (!payments) {
            return res.status(404).json({ error: 'Pago no encontrado.' });
        }
        res.json({ payments });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el pago.' });
    }
}

// Función para crear un pago
async function createPay(req, res) {
    let {
        id_sale,
        id_client,
        total_payment,
    } = req.body;

    // Convierte total_pago a un número
    total_payment = parseFloat(total_payment);
    try {
        if (!id_sale || !id_client || !total_payment) {
            return res.status(400).json({ error: 'Todos los campos requeridos deben estar presentes.' });
        }
        // Consulta la venta relacionada   
        const sale = await Sales.findByPk(id_sale);
        if (!sale) {
            return res.status(404).json({ error: 'Venta no encontrada.' });
        }
        //Verificar que solo se admitan números positivos
        if (total_payment <= 0) {
            return res.status(400).json({ error: 'El pago solo acepta números positivos mayores a 0.' });
        }

        // Verificar si la venta ya está pagada
        if (sale.payment_state === 'Pagado') {
            return res.status(400).json({ error: 'Esta venta ya está pagada y no admite más pagos.' });
        }

        
        const lastPay = await Payments.findOne({
            where: { id_sale },
            order: [['payment_date', 'DESC']], // Ordenar por fecha de pago descendente
        });

        if (lastPay) {
            // Verificar que el total_pago no sea mayor que el total_restante del último pago
            if (total_payment > lastPay.total_remaining) {
                return res.status(400).json({ error: 'El total del pago no puede ser mayor que el total_restante del último pago.' });
            }
        }

        //ver que el total pagado no exeda el total de la venta
        if (total_payment > sale.total_sale) {
            return res.status(400).json({ error: 'El total del pago no puede ser mayor al total de la venta' });
        }
        // Consulta todos los pagos relacionados con la venta
        const relatedPay = await Payments.findAll({
            where: { id_sale },
        });

        // Calcula el total pagado sumando los pagos relacionados
        let totalPay = 0;
        for (const pay of relatedPay) {
            totalPay += parseFloat(pay.total_payment);
        }

        // Añade el total_pago del nuevo pago al totalPagado
        totalPay += total_payment;

        // Calcula el total restante restando el total pagado del total de la venta
        const payRest = sale.total_sale - totalPay;


        // Actualiza el estado de la venta
        if (payRest == 0) {
            sale.payment_state = 'Pagado';
        } else {
            sale.payment_state = 'Por pagar';
        }
        await sale.save();
 
        const newPay= await Payments.create({
            id_sale,
            id_client,
            total_payment,
            total_remaining: payRest, 
        });

        res.status(201).json(newPay);
    } catch (error) {
        console.error('Error al crear el pago:', error); // Agrega esta línea
        res.status(400).json({ error: 'Error al crear el pago.' });
    }
}


// Obtener todos los pagos para una venta específica
async function getPaySale(req, res) {
    const id_sale = req.params.id;

    try {
        const paymSale = await Payments.findAll({
            where: { id_sale },
        });

        if (paymSale.length === 0) {
            return res.status(404).json({ message: "No hay pagos para esta venta" })
        }
        res.json(paymSale);
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getPayClien(req, res) {
    const id_client = req.params.id;

    try {
        const payCliente = await Payments.findAll({
            where: { id_client },
        });

        if (payCliente.length === 0) {
            return res.status(404).json({ message: "No hay pagos para este cliente" })
        }
        res.json(payCliente);
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getPayClienSale(req, res) {
    const id_client = req.params.id;
    const id_sale = req.params.id;

    try {
        const payClienSale = await Payments.findAll({
            where: { id_client, id_sale },
        });

        if (payClienSale.length === 0) {
            return res.status(404).json({ message: "No hay el cliente no ha realizado pagos para esta venta" })
        }
        res.json(payClienSale);
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getAllPay,
    getPayById,
    createPay,
    getPaySale,
    getPayClien,
    getPayClienSale,
};

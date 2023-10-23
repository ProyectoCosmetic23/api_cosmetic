const Pagos = require('../../models/pagos');
const Ventas = require('../../models/ventas');


// Obtener todos los pagos
const getAllPagos = async (req, res) => {
    try {
        const pagos = await Pagos.findAll();
        if (pagos.length === 0) {
            return res.status(404).json({ message: "No hay pagos" })
        }
        res.json(pagos);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Obtener un pago por ID
async function getPagoById(req, res) {
    const { id } = req.params;
    try {
        const pagos = await Pagos.findByPk(id);
        if (!pagos) {
            return res.status(404).json({ error: 'Pago no encontrado.' });
        }
        res.json({ pagos });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el pago.' });
    }
}

// Función para crear un pago
async function createPago(req, res) {
    let {
        id_venta,
        id_cliente,
        total_pago,
    } = req.body;

    // Convierte total_pago a un número
    total_pago = parseFloat(total_pago);
    try {
        if (!id_venta || !id_cliente || !total_pago) {
            return res.status(400).json({ error: 'Todos los campos requeridos deben estar presentes.' });
        }
        // Consulta la venta relacionada   
        const venta = await Ventas.findByPk(id_venta);
        if (!venta) {
            return res.status(404).json({ error: 'Venta no encontrada.' });
        }
        //Verificar que solo se admitan números positivos
        if (total_pago <= 0) {
            return res.status(400).json({ error: 'El pago solo acepta números positivos mayores a 0.' });
        }

        // Verificar si la venta ya está pagada
        if (venta.estado_pago === 'Pagado') {
            return res.status(400).json({ error: 'Esta venta ya está pagada y no admite más pagos.' });
        }

        
        const ultimoPago = await Pagos.findOne({
            where: { id_venta },
            order: [['fecha_pago', 'DESC']], // Ordenar por fecha de pago descendente
        });

        if (ultimoPago) {
            // Verificar que el total_pago no sea mayor que el total_restante del último pago
            if (total_pago > ultimoPago.total_restante) {
                return res.status(400).json({ error: 'El total del pago no puede ser mayor que el total_restante del último pago.' });
            }
        }

        //ver que el total pagado no exeda el total de la venta
        if (total_pago > venta.total_venta) {
            return res.status(400).json({ error: 'El total del pago no puede ser mayor al total de la venta' });
        }
        // Consulta todos los pagos relacionados con la venta
        const pagosRelacionados = await Pagos.findAll({
            where: { id_venta },
        });

        // Calcula el total pagado sumando los pagos relacionados
        let totalPagado = 0;
        for (const pago of pagosRelacionados) {
            totalPagado += parseFloat(pago.total_pago);
        }

        // Añade el total_pago del nuevo pago al totalPagado
        totalPagado += total_pago;

        // Calcula el total restante restando el total pagado del total de la venta
        const totalRestante = venta.total_venta - totalPagado;


        // Actualiza el estado de la venta
        if (totalRestante <= 0) {
            venta.estado_pago = 'Pagado';
        } else {
            venta.estado_pago = 'Por pagar';
        }
        await venta.save();
 
        const nuevoPago = await Pagos.create({
            id_venta,
            id_cliente,
            total_pago,
            total_restante: totalRestante, 
        });

        res.status(201).json(nuevoPago);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el pago.' });
    }
}


// Obtener todos los pagos para una venta específica
async function getPagosVenta(req, res) {
    const id_venta = req.params.id;

    try {
        const pagosVenta = await Pagos.findAll({
            where: { id_venta },
        });

        if (pagosVenta.length === 0) {
            return res.status(404).json({ message: "No hay pagos para esta venta" })
        }
        res.json(pagosVenta);
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getPagosClien(req, res) {
    const id_cliente = req.params.id;

    try {
        const pagosCliente = await Pagos.findAll({
            where: { id_cliente },
        });

        if (pagosCliente.length === 0) {
            return res.status(404).json({ message: "No hay pagos para este cliente" })
        }
        res.json(pagosCliente);
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getPagosClienVent(req, res) {
    const id_cliente = req.params.id;
    const id_venta = req.params.id;

    try {
        const pagosClienteVenta = await Pagos.findAll({
            where: { id_cliente, id_venta },
        });

        if (pagosClienteVenta.length === 0) {
            return res.status(404).json({ message: "No hay el cliente no ha realizado pagos para esta venta" })
        }
        res.json(pagosClienteVenta);
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getAllPagos,
    getPagoById,
    createPago,
    getPagosVenta,
    getPagosClien,
    getPagosClienVent,
};

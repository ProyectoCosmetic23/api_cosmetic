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
        fecha_pago,
        total_pago,
    } = req.body;

    // Convierte total_pago a un número
    total_pago = parseFloat(total_pago);

    try {
        // Consulta la venta relacionada
        const venta = await Ventas.findByPk(id_venta);
        if (!venta) {
            return res.status(404).json({ error: 'Venta no encontrada.' });
        }

        // Consulta todos los pagos relacionados con la venta
        const pagosRelacionados = await Pagos.findAll({
            where: { id_venta },
        });

        // Calcula el total pagado sumando los pagos relacionados
        let totalPagado = 0;
        for (const pago of pagosRelacionados) {
            totalPagado += parseFloat(pago.total_pago); // Convierte total_pago a un número antes de sumarlo
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

        // Crea un nuevo pago con los datos proporcionados y el total_restante calculado
        const nuevoPago = await Pagos.create({
            id_venta,
            id_cliente,
            total_pago,
            fecha_pago,
            total_restante: totalRestante, // Usa el total_restante calculado al crear el pago
        });

        // Si se creó con éxito, devuelve una respuesta con el pago creado
        res.status(201).json(nuevoPago);
    } catch (error) {
        // En caso de error, devuelve un mensaje de error
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

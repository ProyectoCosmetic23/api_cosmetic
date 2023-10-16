// ventasController.js
const Ventas = require('../../models/ventas');
const Detalle_Venta = require('../../models/detalle_venta');

// Obtener todas las ventas
const getAllSales = async (req, res) => {
    try {
        const ventas = await Ventas.findAll();
        if (ventas.length === 0) {
            return res.status(404).json({ message: "No hay ventas registradas" })
        }
        res.json(ventas);
    } catch (error) {
        console.error('Error fetching sales:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Obtener una venta por ID
async function getSaleById(req, res) {
    const { id } = req.params;
    try {
        const ventas = await Ventas.findByPk(id);
        const detalle_venta = await Detalle_Venta.findAll({
            where: { id_venta: id }
        });
        if (!ventas) {
            return res.status(404).json({ error: 'Venta no encontrado.' });
        }
        res.json({ ventas, detalle_venta });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la venta.' });
    }
}

// Anular una venta
async function anulateSaleById(req, res) {
    const { id } = req.params;
    var estado_venta = "Anulado";
    try {
        const venta = await Ventas.findByPk(id);
        if (!venta) {
            return res.status(404).json({ error: 'Venta no encontrada.' });
        }
        await venta.update({
            estado_venta: estado_venta
        });
        res.json(venta);
    } catch (error) {
        res.status(500).json({ error: 'Error al anular la venta.' });
    }
}

// Exportar las funciones del módulo
module.exports = {
    getAllSales,
    getSaleById,
    anulateSaleById
};



// ventasController.js
const Sales = require('../../models/sales');
const Sale_Detail = require('../../models/sale_detail');

// Obtener todas las ventas
const getAllSales = async (req, res) => {
    try {
        const sales = await Sales.findAll();
        if (sales.length === 0) {
            return res.status(404).json({ message: "No hay ventas registradas" })
        }
        res.json(sales);
    } catch (error) {
        console.error('Error interno sales:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Obtener una venta por ID
async function getSaleById(req, res) {
    const { id } = req.params;
    try {
        const sales = await sales.findByPk(id);
        const sale_detail = await Sale_Detail.findAll({
            where: { id_sale: id }
        });
        if (!sales) {
            return res.status(404).json({ error: 'Venta no encontrado.' });
        }
        res.json({ sales, sale_detail });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la venta.' });
    }
}

// Anular una venta
async function anulateSaleById(req, res) {
    const { id } = req.params;
    var sale_state = "Anulado";
    try {
        const sale = await Sales.findByPk(id);
        if (!sale) {
            return res.status(404).json({ error: 'Venta no encontrada.' });
        }
        await sale.update({
            sale_state: sale_state
        });
        res.json(sale);
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



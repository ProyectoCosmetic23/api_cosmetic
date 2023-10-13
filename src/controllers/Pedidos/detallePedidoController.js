// pedidosController.js
const Detalle_Pedidos = require('../../models/detalle_pedido');

// Obtener un pedido por ID
async function getOrderDetailById(req, res) {
  const { id } = req.params;
  try {
    const detalle_pedidos = await Detalle_Pedidos.findByPk(id);
    if (!detalle_pedidos) {
      return res.status(404).json({ error: 'Pedido no encontrado.' });
    }
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el pedido.' });
  }
}

module.exports = {
  getOrderDetailById,
};

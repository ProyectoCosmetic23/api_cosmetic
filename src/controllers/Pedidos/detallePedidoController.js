// pedidosController.js
const Pedidos = require('../../models/pedidos');
const Detalle_Pedido = require('../../models/detalle_pedido');

// Editar un detalle_pedido
async function updateOrderDetail(req, res) {
  const { id } = req.params;
  const { productos } = req.body;
  var lista_detalles = []
  var total_pedido = 0;
  try {
    const detalle_pedido = await Detalle_Pedido.findAll({
      where: { id_pedido: id}
    });
    if (!detalle_pedido) {
      return res.status(404).json({ error: 'Detalle de pedido no encontrado.' });
    }
    for (var producto in productos) {
      var id_detalle_pedido = producto.id_detalle_pedido;
      var id_producto = producto.id_producto;
      var cantidad_producto = producto.cantidad_producto;
      var precio_producto = producto.precio_producto;
      var subtotal = cantidad_producto * precio_producto;
      total_pedido += subtotal;
      const detalle_pedido_actual = await Detalle_Pedido.findByPk(id_detalle_pedido)
      await detalle_pedido_actual.update({
        id_producto: id_producto,
        cantidad_producto: cantidad_producto,
        precio_producto: precio_producto,
      });
      lista_detalles.push(detalle_pedido_actual);
    }
    const update_pedido = await Pedidos.findByPk(id)
    await update_pedido.update({
      total_pedido: total_pedido
    })
    res.json({detalle_actualizado: lista_detalles});
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el pedido.' });
  }
}

module.exports = {
  updateOrderDetail
};

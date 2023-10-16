// detalleVentaController.js
const Ventas = require('../../models/ventas');
const Detalle_Venta = require('../../models/detalle_venta');

// Editar un detalle_venta
async function updateSaleDetail(req, res) {
  const { id } = req.params;
  const { productos } = req.body;
  var lista_detalles = []
  var total_venta = 0;
  try {
    const detalle_venta = await Detalle_Venta.findAll({
      where: { id_venta: id}
    });
    if (!detalle_venta) {
      return res.status(404).json({ error: 'Detalle de venta no encontrado.' });
    }
    for (var producto in productos) {
      var id_detalle_venta = producto.id_detalle_venta;
      var id_producto = producto.id_producto;
      var cantidad_producto = producto.cantidad_producto;
      var precio_producto = producto.precio_producto;
      var subtotal = cantidad_producto * precio_producto;
      total_venta += subtotal;
      const detalle_venta_actual = await Detalle_Venta.findByPk(id_detalle_venta)
      await detalle_venta_actual.update({
        id_producto: id_producto,
        cantidad_producto: cantidad_producto,
        precio_producto: precio_producto,
      });
      lista_detalles.push(detalle_venta_actual);
    }
    const update_venta = await Ventas.findByPk(id)
    await update_venta.update({
      total_venta: total_venta
    })
    res.json({detalle_actualizado: lista_detalles});
  } catch (error) {
    res.status(500).json({ error: 'Error al editar la venta.' });
  }
}

module.exports = {
  updateSaleDetail
};

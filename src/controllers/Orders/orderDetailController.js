// pedidosController.js
const Orders = require('../../models/orders');
const Order_Detail = require('../../models/order_detail');

// Editar un detalle_pedido
async function updateOrderDetail(req, res) {
  const { id } = req.params;
  const { products } = req.body;
  var detail_list = []
  var total_order = 0;
  try {
    const order_detail = await Order_Detail.findAll({
      where: { id_pedido: id}
    });
    if (!order_detail) {
      return res.status(404).json({ error: 'Detalle de pedido no encontrado.' });
    }
    for (var product in products) {
      var id_order_detail = product.id_order_detail;
      var id_product = product.id_product;
      var product_quantity = product.product_quantity;
      var product_price = product.product_price;
      var subtotal = product_quantity * product_price;
      total_order += subtotal;
      const actual_order_detail = await Order_Detail.findByPk(id_order_detail)
      await actual_order_detail.update({
        id_product: id_product,
        product_quantity: product_quantity,
        product_price: product_price,
      });
      detail_list.push(actual_order_detail);
    }
    const update_order = await Orders.findByPk(id)
    await update_order.update({
      total_order: total_order
    })
    res.json({updadted_detail: detail_list});
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el pedido.' });
  }
}

module.exports = {
  updateOrderDetail
};
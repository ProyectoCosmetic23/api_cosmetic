// detalleVentaController.js
const Sales = require('../../models/sales');
const Sale_Detail = require('../../models/sale_detail');

// Editar un detalle_venta
async function updateSaleDetail(req, res) {
  const { id } = req.params;
  const { products } = req.body;
  var detail_list = []
  var total_sale = 0;
  try {
    const sale_detail = await Sale_Detail.findAll({
      where: { id_sale: id }
    });
    if (!sale_detail) {
      return res.status(404).json({ error: 'Detalle de venta no encontrado.' });
    }
    for (var product in products) {
      var id_sale_detail = product.id_detalle_venta;
      var id_product = product.id_producto;
      var product_quantity = product.product_quantity;
      var product_price = product.product_price;
      var subtotal = cantidad_producto * precio_producto;
      total_sale += subtotal;
      const actual_sale_detail = await Sale_Detail.findByPk(id_sale_detail)
      await actual_sale_detail.update({
        id_product: id_product,
        product_quantity: product_quantity,
        product_price: product_price,
      });
      detail_list.push(actual_sale_detail);
    }
    const update_sale = await Sales.findByPk(id)
    await update_sale.update({
      total_sale: total_sale
    })
    res.json({ detalle_actualizado: detail_list });
  } catch (error) {
    res.status(500).json({ error: 'Error al editar la venta.' });
  }
}

module.exports = {
  updateSaleDetail
};

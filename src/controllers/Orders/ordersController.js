// pedidosController.js
const Orders = require('../../models/orders');
const Order_Detail = require('../../models/order_detail');
const Sales = require('../../models/sales');
const Sale_Detail = require('../../models/sale_detail');

// Obtener todos los pedidos
const getAllOrders = async (req, res) => {
  try {
    const orders = await Orders.findAll();
    if (orders.length === 0) {
      return res.status(404).json({ message: "No hay pedidos registrados" })
    }
    res.json(orders);
  } catch (error) {
    console.error('Error al obtener Pedidos:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Obtener un pedido por ID
async function getOrderById(req, res) {
  const { id } = req.params;
  try {
    const orders = await Orders.findByPk(id);
    const order_detail = await Order_Detail.findAll({
      where: { id_order: id }
    });
    if (!orders) {
      return res.status(404).json({ error: 'Pedido no encontrado.' });
    }
    res.json({ orders, order_detail });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el pedido.' });
  }
}

// Crear un pedido
async function createOrder(req, res) {
  const { id_client, id_employee, order_number, order_date, delivery_date, payment_type, total_order, products } = req.body;
  var order_state = "Activo";
  var delivery_state = "En proceso";
  var payment_state = "Por pagar";
  try {
    const newOrder = await Orders.create({
      id_client,
      id_employee,
      order_number,
      order_date,
      delivery_date,
      payment_type,
      order_state,
      delivery_state,
      payment_state,
      total_order
    });
    var id_order = newOrder.id_order;
    var order_detail = [];
    for (const product of products) {
      var id_product = product.id_product;
      var product_quantity = product.product_quantity;
      var product_price = product.product_price;
      const order_detail_prod = await Order_Detail.create({
        id_order,
        id_product,
        product_quantity,
        product_price,
      });
      order_detail.push(order_detail_prod);
    }
    res.status(201).json({ newOrder, order_detail });
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el pedido.' });
    console.log(error.message);
  }
}

// Anulate an order
async function anulateOrderById(req, res) {
  const { id } = req.params;
  var order_state = "Anulado";
  try {
    const order = await Orders.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado.' });
    }
    await order.update({
      order_state: order_state
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error al anular el pedido.' });
  }
}

// Update the delivery status of an order
async function updateDeliveryStatusById(req, res) {
  const { id } = req.params;
  try {
    const order = await Orders.findByPk(id);
    console.log(order);
    const orderDetail = await Order_Detail.findAll({
      where: { id_order: id }
    });
    console.log(orderDetail);
    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado.' });
    }
    if (order.delivery_state === "Entregado") {
      return res.status(404).json({ error: 'El pedido ya ha sido entregado.' });
    } else {
      if (order.delivery_state === "En proceso") {
        const newDeliveryStatus = "Por entregar";
        try {
          const updatedOrder = await order.update({
            delivery_state: newDeliveryStatus
          });
          res.json({ updatedOrder });
        } catch (error) {
          console.error('Error al actualizar el estado del pedido:', error);
          res.status(500).json({ error: 'Error al actualizar el estado del pedido.' });
        }
      } else if (order.delivery_state === "Por entregar") {
        const id_order = order.id_order;
        const id_client = order.id_client;
        const id_employee = order.id_employee;
        const order_number = order.order_number;
        const order_date = order.order_date;
        const payment_state = "Por pagar";
        const total_order = order.total_order;
        const payment_type = order.payment_type;
        const sale_status = "Activo";
        try {
          const newSale = await Sales.create({
            id_order: id_order,
            id_customer: id_client,
            id_employee: id_employee,
            invoice_number: order_number,
            sale_date: order_date,
            payment_state: payment_state,
            sale_state: sale_status,
            payment_type: payment_type,
            total_sale: total_order
          });
          const sale_id = newSale.id;
          const saleDetailList = [];
          for (const product of orderDetail) {
            const product_id = product.id_product;
            const quantity = product.product_quantity;
            const product_price = product.product_price;
            const newSaleDetail = await Sale_Detail.create({
              id_sale: sale_id,
              id_product: product_id,
              product_quantity: quantity,
              product_price: product_price
            });
            saleDetailList.push(newSaleDetail);
          }
          try {
            const updatedOrder = await order.update({
              delivery_state: "Entregado"
            });
            res.json({ newSale, saleDetailList, updatedOrder });
          } catch (error) {
            console.error('Error al cambiar el estado del pedido:', error);
            res.status(500).json({ error: 'Error al cambiar el estado del pedido.' });
          }
        } catch (error) {
          res.status(500).json({ error: 'Error al enviar el pedido a la sección de ventas.' });
        }
      }
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el pedido.' });
  }
}


// Exportar las funciones del módulo
module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  anulateOrderById,
  updateDeliveryStatusById
};



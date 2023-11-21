// pedidosController.js
const Orders = require('../../models/orders');
const Order_Detail = require('../../models/order_detail');
const Sales = require('../../models/sales');
const Sale_Detail = require('../../models/sale_detail');


// -------------- INICIO: Función para para obtener último N°Pedido -------------- // 

// Función para obtener el último número de factura de Sales
async function getLastInvoiceNumber() {
  try {
    const lastOrder = await Orders.findOne({
      order: [['invoice_number', 'DESC']]
    });

    if (lastOrder) {
      return lastOrder.invoice_number;
    } else {
      return 0; // Si no hay pedidos registrados, empieza desde 1.
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// -------------- FIN: Función para para obtener último N°Pedido -------------- // 

// -------------- INICIO: Funciones para para obtener Pedidos -------------- // 

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
    const order = await Orders.findByPk(id);
    const order_detail = await Order_Detail.findAll({
      where: { id_order: id }
    });
    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado.' });
    }
    res.json({ order, order_detail });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el pedido.' });
  }
}

// -------------- FIN: Funciones para obtener Pedidos -------------- // 

// -------------- INICIO: Funciones para crear un nuevo Pedido -------------- // 

// Función para crear un nuevo pedido
async function createOrder(req, res) {
  const { id_client, id_employee, order_date, payment_type, total_order, products } = req.body;
  const order_state = "Activo";
  const delivery_state = "En proceso";
  const payment_state = "Por pagar";

  try {
    const lastInvoiceNumber = await getLastInvoiceNumber();
    const newInvoiceNumber = lastInvoiceNumber + 1;

    const newOrder = await createNewOrder(id_client, id_employee, newInvoiceNumber, order_date, payment_type, order_state, delivery_state, payment_state, total_order);

    const order_detail = await createOrderDetail(newOrder.id_order, products);

    res.status(201).json({ newOrder, order_detail });
  } catch (error) {
    handleError(res, error, 'Error al crear el pedido.' + error);
  }
}

// Función auxiliar para crear un nuevo pedido
async function createNewOrder(id_client, id_employee, order_number, order_date, payment_type, order_state, delivery_state, payment_state, total_order) {
  try {
    return await Orders.create({
      id_client: id_client,
      id_employee: id_employee,
      order_number: order_number,
      order_date: order_date,
      payment_type: payment_type,
      order_state: order_state,
      delivery_state: delivery_state,
      payment_state: payment_state,
      total_order: total_order
    });
  } catch (error) {
    throw new Error('Error al crear la nueva orden: ' + error.message);
  }
}

// Función para crear el detalle del pedido
async function createOrderDetail(id_order, products) {
  try {
    const order_detail = [];

    for (const product of products) {
      const { id_product, product_quantity, product_price } = product;

      const order_detail_prod = await Order_Detail.create({
        id_order: id_order,
        id_product: id_product,
        product_quantity: product_quantity,
        product_price: product_price,
      });

      order_detail.push(order_detail_prod);
    }

    return order_detail;
  } catch (error) {
    throw new Error('Error al crear el detalle de la orden: ' + error.message);
  }
}

// Función para manejar errores y enviar una respuesta de error
function handleError(res, error, errorMessage) {
  console.error(error);
  res.status(400).json({ error: errorMessage });
}

// -------------- FIN: Funciones para crear un nuevo Pedido -------------- // 

// -------------- INICIO: Funciones para cambiar estado -------------- // 

// Función para anular pedidos por ID
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

// Función para actualizar el estado de entrega del pedido por ID
async function updateDeliveryStatusById(req, res) {
  const { id } = req.params;

  try {
    const order = await Orders.findByPk(id);

    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado.' });
    }
    
    if (order.order_state === 'Anulado') {
      return res.status(404).json({ error: 'El pedido se encuentra anulado.' });
    }

    if (order.delivery_state === "Entregado") {
      return res.status(404).json({ error: 'El pedido ya ha sido entregado.' });
    }

    if (order.delivery_state === "En proceso") {
      await updateOrderDeliveryStatus(order, "Por entregar");
    } else if (order.delivery_state === "Por entregar") {
      const newSaleData = createSaleDataFromOrder(order);
      const { newSale, saleDetailList } = await createSale(newSaleData, order);

      const updatedOrder = await updateOrderDeliveryStatus(order, "Entregado");

      if (updatedOrdernull || updatedOrder === undefined) {
        res.json({ newSale, saleDetailList });
      } else {
        res.json({ newSale, saleDetailList, updatedOrder });
      }
    }
  } catch (error) {
    res.json('Error al actualizar el pedido.' + error);
  }
}

// Función para actualizar el estado de entrega del pedido
async function updateOrderDeliveryStatus(order, newDeliveryStatus) {
  try {
    const updatedOrder = await order.update({ delivery_state: newDeliveryStatus });
    return updatedOrder;
  } catch (error) {
    throw new Error('Error al actualizar el estado del pedido: ' + error);
  }
}

// Función para crear datos de venta a partir de un pedido
function createSaleDataFromOrder(order) {
  const delivery_date = new Date();
  return {
    id_order: order.id_order,
    id_client: order.id_client,
    id_employee: order.id_employee,
    invoice_number: order.order_number,
    order_date: order.order_date,
    delivery_date: delivery_date,
    payment_state: order.payment_state,
    sale_state: "Activo",
    payment_type: order.payment_type,
    total_sale: order.total_order
  };
}

// Función para crear una nueva venta
async function createSale(saleData, order) {
  const newSale = await Sales.create(saleData);
  const saleDetailList = await createSaleDetails(newSale, order);

  return { newSale, saleDetailList };
}

// Función para crear los detalles de una venta
async function createSaleDetails(sale, order) {
  const orderDetail = await Order_Detail.findAll({
    where: { id_order: order.id_order }
  });

  const saleDetailList = [];

  console.log(orderDetail);

  for (const product of orderDetail) {
    const product_id = product.id_product;
    const quantity = product.product_quantity;
    const product_price = product.product_price;

    const newSaleDetail = await Sale_Detail.create({
      id_sale: sale.id_sale,
      id_product: product_id,
      quantity: quantity,
      product_price: product_price
    });

    saleDetailList.push(newSaleDetail);
  }

  return saleDetailList;
}

// Función para manejar errores y enviar una respuesta de error
function handleError(res, error, errorMessage) {
  console.error(error);
  res.status(400).json({ error: errorMessage });
}

// -------------- FIN: Funciones para cambiar estados -------------- // 


// Exportar las funciones del módulo
module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  anulateOrderById,
  updateDeliveryStatusById
};



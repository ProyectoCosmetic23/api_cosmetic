// pedidosController.js
const { Op } = require("sequelize");
const Orders = require("../../models/orders");
const Order_Detail = require("../../models/order_detail");
const Products = require("../../models/products");
const Payments = require("../../models/payments");
const {
  updateComissionsFromSales,
} = require("../Comissions/comissionController");
const { response } = require("express");

// -------------- INICIO: Función para para obtener último N°Pedido -------------- //

// Función para obtener el último número de factura de Sales
async function getLastInvoiceNumber() {
  try {
    const lastOrder = await Orders.findOne({
      order: [["order_number", "DESC"]],
    });

    if (lastOrder) {
      return lastOrder.order_number;
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
    const orders = await Orders.findAll({
      order: [["order_number", "DESC"]],
    });
    res.json(orders);
  } catch (error) {
    console.error("Error al obtener Pedidos:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Obtener todos los pedidos en proceso o por entregar
const getAllProcessingOrders = async (req, res) => {
  try {
    const orders = await Orders.findAll({
      where: {
        delivery_state: {
          [Op.in]: ["En proceso", "Por entregar"],
        },
      },
      order: [["order_number", "DESC"]],
    });
    res.json(orders);
  } catch (error) {
    console.error("Error al obtener Pedidos:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Obtener todos los pedidos entregados
const getAllDeliveredOrders = async (req, res) => {
  try {
    const orders = await Orders.findAll({
      where: {
        delivery_state: "Entregado",
      },
      order: [["order_number", "DESC"]],
    });
    res.json(orders);
  } catch (error) {
    console.error("Error al obtener Pedidos:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Obtener todos los pedidos anulados
const getAllAnulatedOrders = async (req, res) => {
  try {
    const orders = await Orders.findAll({
      where: {
        order_state: "Anulado",
      },
      order: [["order_number", "DESC"]],
    });
    res.json(orders);
  } catch (error) {
    console.error("Error al obtener Pedidos:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Obtener todos los pedidos no pagados
const getAllUnpaidOrders = async (req, res) => {
  try {
    const orders = await Orders.findAll({
      where: {
        payment_state: "Por pagar",
      },
      order: [["order_number", "DESC"]],
    });
    res.json(orders);
  } catch (error) {
    console.error("Error al obtener Pedidos:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Obtener todos los pedidos pagados
const getAllPaidOrders = async (req, res) => {
  try {
    const orders = await Orders.findAll({
      where: {
        payment_state: "Pagado",
      },
      order: [["order_number", "DESC"]],
    });
    res.json(orders);
  } catch (error) {
    console.error("Error al obtener Pedidos:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Obtener todas las ventas pagadas y entregadas
const getAllSales = async (req, res) => {
  try {
    const orders = await Orders.findAll({
      where: {
        payment_state: "Pagado",
        delivery_state: "Entregado",
      },
      order: [["order_number", "DESC"]],
    });
    res.json(orders);
  } catch (error) {
    console.error("Error al obtener Pedidos:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Obtener todos los pedidos que tienen devoluciones asociadas
const getAllReturnOrders = async (req, res) => {
  try {
    const orders = await Orders.findAll({
      where: {
        return_state: true,
      },
      order: [["order_number", "DESC"]],
    });
    res.json(orders);
  } catch (error) {
    console.error("Error al obtener Pedidos:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Obtener un pedido por ID
async function getOrderById(req, res) {
  const { id } = req.params;
  try {
    const order = await Orders.findByPk(id);
    const order_detail = await Order_Detail.findAll({
      where: { id_order: id },
    });
    if (!order) {
      return res.status(404).json({ error: "Pedido no encontrado." });
    }
    res.json({ order, order_detail });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el pedido." });
  }
}

// -------------- FIN: Funciones para obtener Pedidos -------------- //

// -------------- INICIO: Funciones para crear un nuevo Pedido -------------- //

// Función para crear un nuevo pedido
async function createOrder(req, res) {
  const {
    id_client,
    id_employee,
    order_date,
    payment_type,
    total_order,
    products,
    directSale,
  } = req.body;
  const order_state = "Activo";
  let delivery_state;
  let payment_state;

  if (payment_type == "Contado") {
    payment_state = "Pagado";
  } else {
    payment_state = "Por pagar";
  }

  if (directSale == false) {
    delivery_state = "En proceso";
  } else {
    delivery_state = "Entregado";
  }

  try {
    // Obtener el último número de factura
    const lastInvoiceNumber = await getLastInvoiceNumber();
    const newInvoiceNumber = lastInvoiceNumber + 1;

    // Crear una nueva orden
      const newOrder = await createNewOrder(
        id_client,
        id_employee,
        newInvoiceNumber,
        order_date,
        payment_type,
        order_state,
        delivery_state,
        payment_state,
        total_order
      );

    // Crear el detalle de la orden
    const order_detail = await createOrderDetail(newOrder.id_order, products);

    // Actualizar las cantidades de los productos
    await updateProductQuantities(products);

    // Actualizar las comisiones
    await updateComissionsFromSales(new Date(order_date));

    let newPay;

    if (payment_type == "Contado") {
      try {
        newPay = await Payments.create({
          id_order: newOrder.id_order,
          id_client: id_client,
          total_payment: total_order,
          total_remaining: 0,
        });
      } catch (error) {
        console.log(error);
        handleError(res, error, "Error al crear el pedido." + error);
      }
    }
    if (payment_type == "Contado") {
      res.status(201).json({ newOrder, order_detail, newPay });
    } else {
      res.status(201).json({ newOrder, order_detail });
    }
  } catch (error) {
    handleError(res, error, "Error al crear el pedido." + error);
  }
}

// Función para actualizar las cantidades de los productos
async function updateProductQuantities(products) {
  try {
    for (const product of products) {
      const { id_product, product_quantity } = product;

      // Obtener el producto de la base de datos
      const existingProduct = await Products.findByPk(id_product);

      // Verificar si el producto existe y la cantidad es suficiente
      if (existingProduct && existingProduct.quantity >= product_quantity) {
        // Actualizar la cantidad del producto
        await Products.update(
          { quantity: existingProduct.quantity - product_quantity },
          { where: { id_product: id_product } }
        );
      } else {
        throw new Error(
          `Producto no encontrado o cantidad insuficiente para el producto con ID ${id_product}`
        );
      }
    }
  } catch (error) {
    throw new Error(
      "Error al actualizar las cantidades de los productos: " + error.message
    );
  }
}

// Función auxiliar para crear un nuevo pedido
async function createNewOrder(
  id_client,
  id_employee,
  order_number,
  order_date,
  payment_type,
  order_state,
  delivery_state,
  payment_state,
  total_order
) {
  try {
    if (delivery_state == "En Proceso") {
      return await Orders.create({
        id_client: id_client,
        id_employee: id_employee,
        order_number: order_number,
        order_date: order_date,
        payment_type: payment_type,
        order_state: order_state,
        delivery_state: delivery_state,
        payment_state: payment_state,
        total_order: total_order,
      });
    } else if (delivery_state == "Entregado") {
      return await Orders.create({
        id_client: id_client,
        id_employee: id_employee,
        order_number: order_number,
        order_date: order_date,
        payment_type: payment_type,
        order_state: order_state,
        delivery_state: delivery_state,
        delivery_date: order_date,
        payment_state: payment_state,
        total_order: total_order,
      });
    }
  } catch (error) {
    throw new Error("Error al crear la nueva orden: " + error.message);
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
    throw new Error("Error al crear el detalle de la orden: " + error.message);
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
  const data = req.body;
  console.log("msg anular: ", data);
  var order_state = "Anulado";
  try {
    const order = await Orders.findByPk(id, { include: Products });
    if (!order) {
      return res.status(404).json({ error: "Pedido no encontrado." });
    }

    // Actualizar el estado del pedido
    await order.update({
      order_state: order_state,
      delivery_state: order_state,
      payment_state: order_state,
      observation_return: data.observation,
    });

    // Sumar las cantidades de los productos al anular el pedido
    for (const product of order.products) {
      const { id_product, product_quantity } = product;

      // Obtener el producto de la base de datos
      const existingProduct = await Products.findByPk(id_product);

      // Verificar si el producto existe
      if (existingProduct) {
        // Actualizar la cantidad del producto sumando la cantidad del pedido
        await Products.update(
          { quantity: existingProduct.quantity + product_quantity },
          { where: { id_product: id_product } }
        );
      } else {
        throw new Error(`Producto no encontrado con ID ${id_product}`);
      }
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Error al anular el pedido." + error });
  }
}

// Función para actualizar el estado de entrega del pedido por ID
async function updateDeliveryStatusById(req, res) {
  const { id } = req.params;

  try {
    const order = await Orders.findByPk(id);

    if (!order) {
      return res.status(404).json({ error: "Pedido no encontrado." });
    }

    if (order.order_state === "Anulado") {
      return res.status(404).json({ error: "El pedido se encuentra anulado." });
    }

    if (order.delivery_state === "Entregado") {
      return res.status(404).json({ error: "El pedido ya ha sido entregado." });
    }

    if (order.delivery_state === "En proceso") {
      const updatedOrder = await updateOrderDeliveryStatus(
        order,
        "Por entregar"
      );

      res.json({ updatedOrder });
    } else if (order.delivery_state === "Por entregar") {
      const updatedOrder = await updateOrderDeliveryStatus(order, "Entregado");

      res.json({ updatedOrder });
    }
  } catch (error) {
    res.json("Error al actualizar el pedido." + error);
  }
}

// Función para actualizar el estado de entrega del pedido
async function updateOrderDeliveryStatus(order, newDeliveryStatus) {
  try {
    let updatedOrder;

    if (newDeliveryStatus === "Entregado") {
      updatedOrder = await order.update({
        delivery_state: newDeliveryStatus,
        delivery_date: new Date(), // Agrega la fecha actual
      });
    } else {
      updatedOrder = await order.update({
        delivery_state: newDeliveryStatus,
      });
    }

    return updatedOrder;
  } catch (error) {
    throw new Error("Error al actualizar el estado del pedido: " + error);
  }
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
  getAllProcessingOrders,
  getAllDeliveredOrders,
  getAllAnulatedOrders,
  getAllUnpaidOrders,
  getAllPaidOrders,
  getAllSales,
  getAllReturnOrders,
  getOrderById,
  createOrder,
  anulateOrderById,
  updateDeliveryStatusById,
};

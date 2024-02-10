const Returns = require("../../models/returns");
const Products = require("../../models/products");
const Defective_Products = require("../../models/defective_products");
const Orders = require("../../models/orders");
const Order_Detail = require("../../models/order_detail");

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

// Obtener un pedido por ID
async function getReturnById(req, res) {
  const { id } = req.params;
  try {
    const return_detail = await Returns.findAll({
      where: { id_order: id },
    });
    res.json({ return_detail });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el pedido." });
  }
}

// Función para procesar la devolución de productos
const processReturn = async (req, res) => {
  // Validación de datos de entrada
  const {
    id_order,
    id_product,
    product_quantity,
    retire,
    returnReason,
    selling_price,
    subtotal,
  } = req.body;

  if (
    !id_order ||
    !id_product ||
    !product_quantity ||
    !selling_price ||
    !returnReason ||
    !retire ||
    !subtotal
  ) {
    return res
      .status(400)
      .json({ error: "Faltan datos obligatorios en la solicitud." });
  }

  const return_date = new Date();

  // Función para registrar la devolución en la base de datos
  async function registerReturn() {
    const returnData = {
      id_order,
      id_product,
      return_date,
      return_quantity: product_quantity,
      return_value: selling_price,
      return_reason: returnReason,
      return_type: retire,
    };

    const newReturn = await Returns.create(returnData);
    if (!newReturn) {
      return res
        .status(500)
        .json({ error: "Error al registrar la devolución." });
    }

    return newReturn;
  }

  try {
    if (retire == "Dado de Baja") {
      // Procesar devolución para productos defectuosos
      const defectiveProduct = await Defective_Products.create({
        id_order,
        id_product,
        return_date,
        return_quantity: product_quantity,
        return_value: selling_price,
        return_reason: returnReason,
        return_type: retire,
      });

      const registeredReturn = await registerReturn();
      res.json({ defectiveProduct, registeredReturn });
    } else if (retire == "Devuelto al Inventario") {
      try {
        // Procesar devolución al inventario
        const returnedProduct = await Products.findByPk(id_product);
        if (!returnedProduct) {
          return res.status(404).json({ error: "Producto no encontrado." });
        }

        const newQuantity = returnedProduct.quantity + product_quantity;
        await Products.update(
          { quantity: newQuantity },
          { where: { id_product } }
        );

        const registeredReturn = await registerReturn();
        res.json({
          "El stock del producto fue actualizado con éxito": registeredReturn,
        });
      } catch (error) {
        res
          .status(500)
          .json({ error: "Error al procesar la devolución: " + error.message });
      }
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Ocurrió un error inesperado." + error });
  }
};

// Exportar las funciones del módulo
module.exports = {
  processReturn,
  getReturnById,
  getOrderById,
};

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

// Función para obtener el último número de factura de Sales
async function getLastInvoiceNumber() {
  try {
    const lastSale = await Orders.findOne({
      order: [["invoice_number", "DESC"]],
    });

    if (lastSale) {
      return lastSale.invoice_number;
    } else {
      return 0; // Si no hay ventas registradas, empieza desde 1.
    }
  } catch (err) {
    console.error(err);
    throw err;
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
        return_quantity,
        return_value,
        return_reason,
        return_type,
      });

      const registeredReturn = await registerReturn();
      res.json({ defectiveProduct, registeredReturn });
    } else if (retire == "Devuelto al Inventario") {
      // Procesar devolución al inventario
      const returnedProduct = await Products.findByPk(id_product);
      if (!returnedProduct) {
        return res.status(404).json({ error: "Producto no encontrado." });
      }

      const newQuantity = returnedProduct.quantity + return_quantity;
      await Products.update(
        { quantity: newQuantity },
        { where: { id_product } }
      );

      const registeredReturn = await registerReturn();
      res.json({
        "El stock del producto fue actualizado con éxito": registeredReturn,
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Ocurrió un error inesperado." + error });
  }
};

// Función para crear una nueva venta y anular la venta existente
const createNewSaleAndCancelOldSale = async (req, res) => {
  const {
    id_sale,
    id_order,
    id_client,
    id_employee,
    order_date,
    payment_state,
    payment_type,
    products,
    observation_return,
  } = req.body;

  const delivery_date = new Date();
  const sale_state = "Activo";

  try {
    const sales = await Sales.findByPk(id_sale);

    if (!sales) {
      return res.status(404).json({ error: "Venta no encontrada." });
    }

    const lastInvoiceNumber = await getLastInvoiceNumber();

    if (isNaN(lastInvoiceNumber)) {
      return res
        .status(500)
        .json({ error: "No se pudo obtener el número de factura." });
    }

    const newInvoiceNumber = lastInvoiceNumber + 1;

    const new_sale = await Sales.create({
      id_order,
      id_client,
      id_employee,
      invoice_number: newInvoiceNumber,
      order_date,
      delivery_date,
      sale_state,
      payment_state,
      payment_type,
      total_sale: 0,
    });

    var sale_detail = [];
    var total_sale = 0;

    for (var product of products) {
      if (isNaN(product.product_price) || isNaN(product.quantity)) {
        return res.status(400).json({
          error: "Los productos deben tener precios y cantidades válidos.",
        });
      }

      console.log(product);

      const subtotal = product.product_price * product.quantity;
      total_sale += subtotal;
      const id_sale_detail = new_sale.id_sale;
      const id_product = product.id_product;
      const product_quantity = product.quantity;
      const product_price = product.product_price;

      const sale_detail_prod = await Sale_Detail.create({
        id_sale: id_sale_detail,
        id_product: id_product,
        quantity: product_quantity,
        product_price: product_price,
      });

      console.log(sale_detail_prod);

      sale_detail.push(sale_detail_prod);
    }

    const new_state = "Anulada";
    const [updatedRows] = await Sales.update(
      { sale_state: new_state, observation_return: observation_return },
      { where: { id_sale } }
    );

    if (updatedRows === 0) {
      return res.status(500).json({ error: "Error al anular la venta." });
    }

    res.json({
      newSale: new_sale,
      saleDetail: sale_detail,
      totalSale: total_sale,
    });
  } catch (err) {
    console.error("Error al crear la venta:", err);
    return res.status(500).json({ error: "Error al crear la venta." });
  }
};

async function getProductByIdOrder(req, res) {
  const { id } = req.params;

  try {
    const products = await Order_Detail.findByPk(id);
    console.log("products");
    console.log(products);
    if (!products) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }

    const nombreProduc = await Products.findByPk(products.id_product);

    res.json([nombreProduc]);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto." });
  }
}

// Exportar las funciones del módulo
module.exports = {
  processReturn,
  createNewSaleAndCancelOldSale,
  getOrderById,
  getProductByIdOrder,
};

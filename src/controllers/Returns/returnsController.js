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
    const lastSale = await Sales.findOne({
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

// Obtener todas las devoluciones
const getAllReturns = async (req, res) => {
  try {
    const returns = await Returns.findAll();
    if (returns.length === 0) {
      return res
        .status(404)
        .json({ message: "No hay devoluciones registradas" });
    }
    res.json(returns);
  } catch (error) {
    console.error("Error al obtener Devoluciones:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Obtener una devolución por ID
async function getReturnById(req, res) {
  const { id } = req.params;
  try {
    const returnData = await Returns.findByPk(id);
    if (!returnData) {
      return res.status(404).json({ error: "Devolución no encontrada." });
    }
    res.json({ returnData });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la devolución." });
  }
}

// Función para procesar la devolución de productos
const processReturn = async (req, res) => {
  const {
    id_order,
    id_returned_product,
    return_quantity,
    return_product_value,
    return_reason,
    damaged_product,
  } = req.body;

  const return_date = new Date();
  const return_value = return_quantity * return_product_value;

  try {
    async function register_return() {
      const returnData = {
        id_sale: id_sale,
        id_product: id_returned_product,
        return_date: return_date,
        return_quantity: return_quantity,
        return_value: return_value,
        return_reason: return_reason,
      };

      const newReturn = await Returns.create(returnData);
      return newReturn;
    }

    if (damaged_product) {
      const defective_product = await Defective_Products.create({
        id_product: id_returned_product,
        return_reason: return_reason,
        return_date: return_date,
        return_quantity: return_quantity,
        return_value: return_value,
      });
      const registeredReturn = await register_return();
      res.json({ defective_product, registeredReturn });
    } else {
      const returned_product = await Products.findByPk(id_returned_product);
      if (!returned_product) {
        return res.status(404).json({ error: "Producto no encontrado." });
      }
      const newQuantity = returned_product.quantity + return_quantity;
      await Products.update(
        { quantity: newQuantity },
        { where: { id_product: id_returned_product } }
      );
      const registeredReturn = await register_return();
      res.json({
        "El stock del producto fue actualizado con éxito": registeredReturn,
      });
    }
  } catch (err) {
    // Manejar errores
    console.error(err);
    return res.status(500).json({ error: "Ocurrió un error inesperado." });
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
  getAllReturns,
  getReturnById,
  processReturn,
  createNewSaleAndCancelOldSale,
  getOrderById,
  getProductByIdOrder,
};

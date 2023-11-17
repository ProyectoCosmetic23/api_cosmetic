//Purchases controller.js
const Categoria = require('../../models/product_categories');
const Purchase = require ('../../models/purchases');
const Detail_purchase = require ('../../models/purchase_detail');
const Product = require ('../../models/products');
const Proveedor = require ('../../models/providers');

// Obtener todos las purchases
const getAllShopping = async (req, res, next) => {
    try {
      const purchases = await Purchase.findAll();
      if (purchases.length === 0) {
        throw new Error('No se encontraron compras registradas.');
      }
      res.json(purchases);
    } catch (error) {
      console.error('Error al recuperar las compras:', error);
      next(error);
    }
  };
;

// Obtener una purchase por ID este metodo sirve para ver el detalle de la purchase

async function getShoppingById(req, res) {
    const { id } = req.params;
    try {
        const purchases = await Purchase.findByPk(id);
        const detail_purchase = await Detail_purchase.findAll({
            where: { id_purchase: id }
        });
        if (!purchases) {
            return res.status(404).json({ success: false, message: 'Purchase no encontrada.' });
        }
        res.json({ success: true, data: { purchases, detail_purchase } });
    } catch (error) {
        if (error.name === 'SequelizeConnectionError') {
            // Error de conexión a la base de datos
            res.status(500).json({ success: false, message: 'Error de conexión a la base de datos.' });
        } else {
            // Otro error
            console.error('Error al obtener la purchase:', error);
            res.status(500).json({ success: false, message: 'Error al obtener la purchase.' });
        }
    }
}

// Crear una purchase
// Crear una compra
async function createShop(req, res) {
    const {
        id_provider,
        invoice_number,
        purchase_date,
        observation_purchase,
        total_purchase,
        products
    } = req.body;

    try {
        const newPurchase = await Purchase.create({
            id_provider,
            invoice_number,
            purchase_date,
            observation_purchase,
            total_purchase,
        });

        const id_purchase = newPurchase.id_purchase;
        const purchase_detail = [];
        let totalPurchaseAmount = 0;

        for (const product of products) {
            const id_product = product.id_product;
            const id_category = product.id_category;
            const product_quantity = product.product_quantity;
            const cost_price = product.cost_price;
            const selling_price = product.selling_price;
            const vat = product.vat;

            const productDB = await Product.findByPk(id_product);

            if (!productDB) {
                return res.status(404).json({ success: false, message: 'Producto no encontrado.' });
            }

            // Agregar la cantidad comprada al stock existente
            productDB.quantity += product_quantity;

            // Actualizar el precio del producto en el inventario con el precio de la compra
            productDB.cost_price = cost_price;
            productDB.selling_price = selling_price;

            // Validar stock máximo
            if (productDB.quantity >= productDB.stock_maximo) {
                console.log(productDB.name_product + ': Stock máximo alcanzado.');
                // Puedes agregar lógica adicional o almacenar alertas en una lista, según tus necesidades.
            }

            const subtotal = (cost_price + vat) * product_quantity;
            totalPurchaseAmount += subtotal;

            await productDB.save();

            const purchase_detail_product = await Detail_purchase.create({
                id_purchase,
                id_product,
                id_category,
                product_quantity,
                cost_price: productDB.cost_price, // Usar el nuevo precio almacenado en la base de datos
                selling_price: productDB.selling_price,
                vat
            });

            purchase_detail.push(purchase_detail_product);
        }

        // Actualizar el total_purchase en la compra con el valor correcto
        await newPurchase.update({ total_purchase: totalPurchaseAmount });

        res.status(201).json({ newPurchase, purchase_detail });
    } catch (error) {
        res.status(400).json({ error: 'Error al crear la compra.' });
        console.log(error.message);
    }
}






// Anular una purchase
async function anulateShopById(req, res) {
    const { id } = req.params;
    const state_purchase = false;
    let menssage = '';

    try {
        // Obtener la purchase por su ID
        const purchase = await Purchase.findByPk(id);

        if (!purchase) {
            return res.status(404).json({ error: 'Purchase no encontrada.' });
        }

        // Obtener el detalle de purchase asociado a la purchase
        const detail_purchase = await Detail_purchase.findAll({
            where: { id_purchase: id }
        });

        // Verificar si hay detalles de purchase
        if (!detail_purchase || detail_purchase.length === 0) {
            return res.status(404).json({ menssage: 'Detalles de purchase no encontrados.' });
        }

        // Calcular la quantity total a anular y actualizar el inventario
        let quantityTotalAnulate = 0;

        for (const detalle of detail_purchase) {
            quantityTotalAnulate += detalle.product_quantity;

            // Obtener el product asociado a este detalle
            const productDB = await Product.findByPk(detalle.id_product);

            if (!productDB) {
                return res.status(404).json({ menssage: 'Product no encontrado.' });
            }

            // Actualizar el inventario restando la quantity anulada
            const nuevoInventario = productDB.quantity - detalle.product_quantity;

            // Actualizar el product en la base de datos
            await productDB.update({
                quantity: nuevoInventario,
            });
        }

        // Actualizar el estado de la purchase
        await purchase.update({
            state_purchase: state_purchase,
        });

        res.json(purchase);
    } catch (error) {
        res.status(500).json({ menssage: 'Error al anular la purchase.' });
    }
}



// Middleware function to validate if a category already exists
async function validateInvoiceExists(req, res, next) {
    try {
      const { invoice_number } = req.query;
  
      // Check if a category with the same name exists
      const existingInvoice = await Purchase.findOne({ where: { invoice_number: invoice_number} });
  
      if (existingInvoice) {
        // If a category with the same name exists, return an error response
        return res.status(400).json(true);
      }
  
      // Check if the category name is empty
      if (!invoice_number) {
        // If the category name is empty, return an error response
        return res.status(400).json(true);
      }
  
      // Continue to the next middleware or route handler
      return res.status(200).json(false);
    } catch (error) {
      // Handle any errors that may occur during the process
      return res.status(500).json({ message: "Error interno del servidor"});
    }
  }
  

//Exportar las funciones del módulo purchases|

module.exports = {
    getAllShopping,
    getShoppingById,
    createShop,
    anulateShopById,
    validateInvoiceExists
};
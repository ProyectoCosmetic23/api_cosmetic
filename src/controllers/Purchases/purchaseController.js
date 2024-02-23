//Purchases controller.js
const Purchase = require('../../models/purchases');
const Detail_purchase = require('../../models/purchase_detail');
const Product = require('../../models/products');
const Providers = require('../../models/providers');
const Product_Categories = require('../../models/product_categories');
const flatted = require('flatted');
const Purchase_Detail = require('../../models/purchase_detail');

// Obtener todos las purchases
const getAllShopping = async (req, res, next) => {
    try {
        const purchases = await Purchase.findAll({
            include: [
                { model: Providers, attributes: ['id_provider', 'name_provider'] }
            ]
        });

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
        const purchases = await Purchase.findOne({
            where: { id_purchase: id },
            include: [
                { model: Providers, attributes: ['id_provider', 'name_provider'] },
                { 
                    model: Purchase_Detail, attributes: ['id_product', 'id_category', 'cost_price', 
                'selling_price', 'vat', 'product_quantity'], 
                include: [
                    {
                        model: Product, attributes: ['id_product', 'name_product'],
                        include: [
                            { model: Product_Categories, attributes: ['id_category', 'name_category'] }
                        ]
                    }
                ] 
            },
            ]
        })

        // const detail_purchase = await Detail_purchase.findAll({
        //     where: { id_purchase: id },
        //     include: [
        //         {
        //             model: Product, attributes: ['id_product', 'name_product'],
        //             include: [
        //                 { model: Product_Categories, attributes: ['id_category', 'name_category'] }
        //             ]
        //         }
        //     ]
        // });
        if (!purchases) {
            return res.status(404).json({ success: false, message: 'Purchase no encontrada.' });
        }
        // const purchasesData =  flatted.parse(flatted.stringify({...purchases, products: detail_purchase}));
        res.json(purchases);
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






async function anulateShopById(req, res) {
    const { id } = req.params;
    const { reasonAnulate } = req.body;
    let menssage = '';

    try {
        // Obtener la compra por su ID
        const purchase = await Purchase.findByPk(id);

        if (!purchase) {
            return res.status(404).json({ error: 'Compra no encontrada.' });
        }

        // Obtener el detalle de compra asociado a la compra
        const detail_purchase = await Detail_purchase.findAll({
            where: { id_purchase: id }
        });

        // Verificar si hay detalles de compra
        if (!detail_purchase || detail_purchase.length === 0) {
            return res.status(404).json({ menssage: 'Detalles de compra no encontrados.' });
        }

        // Calcular la cantidad total a anular y actualizar el inventario
        let quantityTotalAnulate = 0;

        for (const detalle of detail_purchase) {
            quantityTotalAnulate += detalle.product_quantity;

            // Verificar si la cantidad a anular es mayor que cero
            if (detalle.product_quantity > 0) {
                // Obtener el producto asociado a este detalle
                const productDB = await Product.findByPk(detalle.id_product);

                if (!productDB) {
                    return res.status(404).json({ menssage: 'Producto no encontrado.' });
                }

                // Calcular el nuevo inventario
                const nuevoInventario = Math.max(productDB.quantity - detalle.product_quantity, 0);

                // Actualizar el producto en la base de datos solo si la cantidad a anular es mayor que cero
                await productDB.update({
                    quantity: nuevoInventario,
                });
            }
        }

        // Actualizar el estado de la compra
        await purchase.update({
            reason_anulate: reasonAnulate,
            state_purchase: false,
        });

        res.json({ message: 'Compra anulada exitosamente.' });
    } catch (error) {
        // Manejo de errores
        res.status(500).json({ message: 'Error al anular la compra.' });
    }
};





// Middleware function to validate if a category already exists
async function validateInvoiceExists(req, res, next) {
    try {
        const { invoice_number } = req.query;

        // Check if a category with the same name exists
        const existingInvoice = await Purchase.findOne({ where: { invoice_number: invoice_number } });

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
        return res.status(500).json({ message: "Error interno del servidor" });
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
//Purchases controller.js
const Categoria = require('../../models/product_categories');
const Purchase = require ('../../models/purchases');
const Detail_purchase = require ('../../models/purchase_detail');
const Product = require ('../../models/products');
const Proveedor = require ('../../models/providers');

// Obtener todos las purchases
const getAllShopping = async (req, res) => {
    try {
        const purchases = await Purchase.findAll();
        if (purchases.length === 0) {
            return res.status(404).json({ success: false, message: "No hay purchases registradas" });
        }
        res.json({ success: true, data: purchases });
    } catch (error) {
        console.error('Error al obtener las purchases:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
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
async function createShop(req, res) {
    const {
        id_provider,
        invoice_number,
        purchase_date,
        state_purchase,
        observation_purchase,
        products
    } = req.body;
    let menssage = '';
    let alerts = [];
    
    try {
        // Validaciones
        if (isNaN(invoice_number)) {
            menssage = "El número de factura debe contener solo números";
        } else if (invoice_number.trim() === '') {
            menssage = "El número de factura no debe estar vacío";
        } else {
            // Verificar que el número de factura no se repita en la base de datos
            const invoiceExisting = await Purchase.findOne({ where: { invoice_number } });
            if (invoiceExisting) {
                menssage = "El número de factura ya existe. Debe ser único.";
            }
        }
        
        // Validar que la fecha de purchase no sea mayor a la fecha actual
        const actuallyDate = new Date();
        const purchaseDateDate = new Date(purchase_date);
        if (purchaseDateDate > actuallyDate) {
            menssage = "La fecha de purchase no puede ser mayor a la fecha actual.";
        }

        if (observation_purchase.length > 100) {
            menssage = "La observación no puede tener más de 100 caracteres";
        }

        if (products.length === 0) {
            menssage = "Debes agregar al menos un product a la purchase.";
        }

        if (menssage) {
            return res.status(400).json({ success: false, message: menssage });
        }

        // Continuar con la creación de la purchase
        const newPurchase = await Purchase.create({
            id_provider,
            invoice_number,
            purchase_date,
            state_purchase,
            observation_purchase,
            total_purchase: 0
        });
    function validateStockMax(productDB,alerts) {
    if(productDB.quantity >= productDB.stock_maximo){
        alerts.push(productDB.name_product+ ': Stock maximo alcanzado.');
    }
    return alerts;
}

        const id_purchase = newPurchase.id_purchase;
        let total_purchase = 0;

        // Iterar a través de los products y crear detalles de purchase
        for (const product of products) {
            const id_product = product.id_product;
            const quantity_product = product.quantity_product;

            // Encontrar el product correspondiente en la base de datos
            const productDB = await Product.findByPk(id_product);

            if (!productDB) {
                return res.status(404).json({ success: false, message: 'Product no encontrado.' });
            }

            const categoriaDB = await Categoria.findByPk(productDB.id_categoria);

            if (!categoriaDB) {
                return res.status(404).json({ success: false, message: 'Categoría no encontrada.' });
            }


            // Actualizar el stock
            productDB.quantity += quantity_product;

            alerts = validateStockMax(productDB, alerts);

            // Calcular el subtotal y actualizar el precio de costo y precio de venta
            const subtotal = productDB.cost_price * quantity_product;
            total_purchase += subtotal;

            // Actualizar precio de costo y precio de venta
            if (quantity_product <= 0 || productDB.cost_price > productDB.selling_price) {
                menssage = "La quantity del product debe ser mayor a cero y el precio de costo no puede ser mayor al precio de venta";
                return res.status(400).json({ success: false, message: menssage });
            }

            await productDB.save();

            // Crear el detalle de purchase
            await Detail_purchase.create({
                id_purchase,
                id_product,
                categoria_product: productDB.id_categoria,
                quantity_product,
                cost_price: productDB.cost_price,
                selling_price: productDB.selling_price,
                subtotal,
            });
        }

        // Actualizar el total de la purchase
        newPurchase.total_purchase = total_purchase;
        await newPurchase.save();

        const purchasefinal = { ...newPurchase };
        purchasefinal.products = products;

        res.status(201).json({
            success: true,
            purchase: purchasefinal,
            result: {
                menssage: "Purchase creada correctamente",
                alerts: alerts,
            }
        });
    } catch (error) {
        console.error('Error al crear la purchase:', error);
        res.status(500).json({ success: false, message: 'Error al crear la purchase.' });
    }
}



// Anular una purchase
async function anulateShopById(req, res) {
    const { id } = req.params;
    const state_purchase = "Anulado";
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
            quantityTotalAnulate += detalle.quantity_product;

            // Obtener el product asociado a este detalle
            const productDB = await Product.findByPk(detalle.id_product);

            if (!productDB) {
                return res.status(404).json({ menssage: 'Product no encontrado.' });
            }

            // Actualizar el inventario restando la quantity anulada
            const nuevoInventario = productDB.quantity - detalle.quantity_product;

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


//Exportar las funciones del módulo purchases|

module.exports = {
    getAllShopping,
    getShoppingById,
    createShop,
    anulateShopById,
};
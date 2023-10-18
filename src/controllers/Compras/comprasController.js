//Compras controller.js
const Categoria = require('../../models/categorias_productos');
const Compra = require ('../../models/compras');
const Detalle_Compra = require ('../../models/detalle_compra');
const Producto = require ('../../models/productos');
const Proveedor = require ('../../models/proveedores');

// Obtener todos las compras
const getAllShopping = async (req, res) => {
    try {
        const compras = await Compra.findAll();
        if (compras.length === 0) {
            return res.status(404).json({ success: false, message: "No hay compras registradas" });
        }
        res.json({ success: true, data: compras });
    } catch (error) {
        console.error('Error al obtener las compras:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};
;

// Obtener una compra por ID este metodo sirve para ver el detalle de la compra

async function getShoppingById(req, res) {
    const { id } = req.params;
    try {
        const compras = await Compra.findByPk(id);
        const detalle_compra = await Detalle_Compra.findAll({
            where: { id_compra: id }
        });
        if (!compras) {
            return res.status(404).json({ success: false, message: 'Compra no encontrada.' });
        }
        res.json({ success: true, data: { compras, detalle_compra } });
    } catch (error) {
        if (error.name === 'SequelizeConnectionError') {
            // Error de conexión a la base de datos
            res.status(500).json({ success: false, message: 'Error de conexión a la base de datos.' });
        } else {
            // Otro error
            console.error('Error al obtener la compra:', error);
            res.status(500).json({ success: false, message: 'Error al obtener la compra.' });
        }
    }
}

// Crear una compra
async function createShop(req, res) {
    const {
        id_proveedor,
        numero_factura,
        fecha_compra,
        estado_compra,
        observacion_compra,
        productos
    } = req.body;
    let mensaje = '';
    let alertas = [];
    
    try {
        // Validaciones
        if (isNaN(numero_factura)) {
            mensaje = "El número de factura debe contener solo números";
        } else if (numero_factura.trim() === '') {
            mensaje = "El número de factura no debe estar vacío";
        } else {
            // Verificar que el número de factura no se repita en la base de datos
            const facturaExistente = await Compra.findOne({ where: { numero_factura } });
            if (facturaExistente) {
                mensaje = "El número de factura ya existe. Debe ser único.";
            }
        }
        
        // Validar que la fecha de compra no sea mayor a la fecha actual
        const fechaActual = new Date();
        const fechaCompraDate = new Date(fecha_compra);
        if (fechaCompraDate > fechaActual) {
            mensaje = "La fecha de compra no puede ser mayor a la fecha actual.";
        }

        if (observacion_compra.length > 100) {
            mensaje = "La observación no puede tener más de 100 caracteres";
        }

        if (productos.length === 0) {
            mensaje = "Debes agregar al menos un producto a la compra.";
        }

        if (mensaje) {
            return res.status(400).json({ success: false, message: mensaje });
        }

        // Continuar con la creación de la compra
        const nuevaCompra = await Compra.create({
            id_proveedor,
            numero_factura,
            fecha_compra,
            estado_compra,
            observacion_compra,
            total_compra: 0
        });
    function validateStockMax(productoDB,alertas) {
    if(productoDB.cantidad >= productoDB.stock_maximo){
        alertas.push(productoDB.nombre_producto+ ': Stock maximo alcanzado.');
    }
    return alertas;
}

        const id_compra = nuevaCompra.id_compra;
        let total_compra = 0;

        // Iterar a través de los productos y crear detalles de compra
        for (const producto of productos) {
            const id_producto = producto.id_producto;
            const cantidad_producto = producto.cantidad_producto;

            // Encontrar el producto correspondiente en la base de datos
            const productoDB = await Producto.findByPk(id_producto);

            if (!productoDB) {
                return res.status(404).json({ success: false, message: 'Producto no encontrado.' });
            }

            const categoriaDB = await Categoria.findByPk(productoDB.id_categoria);

            if (!categoriaDB) {
                return res.status(404).json({ success: false, message: 'Categoría no encontrada.' });
            }


            // Actualizar el stock
            productoDB.cantidad += cantidad_producto;

            alertas = validateStockMax(productoDB, alertas);

            // Calcular el subtotal y actualizar el precio de costo y precio de venta
            const subtotal = productoDB.precio_costo * cantidad_producto;
            total_compra += subtotal;

            // Actualizar precio de costo y precio de venta
            if (cantidad_producto <= 0 || productoDB.precio_costo > productoDB.precio_venta) {
                mensaje = "La cantidad del producto debe ser mayor a cero y el precio de costo no puede ser mayor al precio de venta";
                return res.status(400).json({ success: false, message: mensaje });
            }

            await productoDB.save();

            // Crear el detalle de compra
            await Detalle_Compra.create({
                id_compra,
                id_producto,
                categoria_producto: productoDB.id_categoria,
                cantidad_producto,
                precio_costo: productoDB.precio_costo,
                precio_venta: productoDB.precio_venta,
                subtotal,
            });
        }

        // Actualizar el total de la compra
        nuevaCompra.total_compra = total_compra;
        await nuevaCompra.save();

        const comprafinal = { ...nuevaCompra };
        comprafinal.productos = productos;

        res.status(201).json({
            success: true,
            compra: comprafinal,
            result: {
                mensaje: "Compra creada correctamente",
                alertas: alertas,
            }
        });
    } catch (error) {
        console.error('Error al crear la compra:', error);
        res.status(500).json({ success: false, message: 'Error al crear la compra.' });
    }
}



// Anular una compra
async function anulateShopById(req, res) {
    const { id } = req.params;
    const estado_compra = "Anulado";
    let mensaje = '';

    try {
        // Obtener la compra por su ID
        const compra = await Compra.findByPk(id);

        if (!compra) {
            return res.status(404).json({ error: 'Compra no encontrada.' });
        }

        // Obtener el detalle de compra asociado a la compra
        const detalle_compra = await Detalle_Compra.findAll({
            where: { id_compra: id }
        });

        // Verificar si hay detalles de compra
        if (!detalle_compra || detalle_compra.length === 0) {
            return res.status(404).json({ mensaje: 'Detalles de compra no encontrados.' });
        }

        // Calcular la cantidad total a anular y actualizar el inventario
        let cantidadTotalAnular = 0;

        for (const detalle of detalle_compra) {
            cantidadTotalAnular += detalle.cantidad_producto;

            // Obtener el producto asociado a este detalle
            const productoDB = await Producto.findByPk(detalle.id_producto);

            if (!productoDB) {
                return res.status(404).json({ mensaje: 'Producto no encontrado.' });
            }

            // Actualizar el inventario restando la cantidad anulada
            const nuevoInventario = productoDB.cantidad - detalle.cantidad_producto;

            // Actualizar el producto en la base de datos
            await productoDB.update({
                cantidad: nuevoInventario,
            });
        }

        // Actualizar el estado de la compra
        await compra.update({
            estado_compra: estado_compra,
        });

        res.json(compra);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al anular la compra.' });
    }
}


//Exportar las funciones del módulo compras|

module.exports = {
    getAllShopping,
    getShoppingById,
    createShop,
    anulateShopById,
};
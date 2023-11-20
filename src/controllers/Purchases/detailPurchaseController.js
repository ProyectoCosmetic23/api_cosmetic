// purchaseController.js
const Compra = require('../../models/purchase');
const Detalle_Compra = require('../../models/detalle_compra');
const Proveedor = require('../../models/proveedores');

// Obtener todos los purchase
const getAllShops = async (req, res) => {
  try {
    const purchase = await Compra.findAll();
    if (purchase.length === 0) {
      return res.status(404).json({ message: "No hay purchase registrados" })
    }
    res.json(purchase);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Obtener un compra por ID
async function getShopById(req, res) {
  const { id } = req.params;
  try {
    const purchase = await Compra.findByPk(id);
    const detalle_compra = await Detalle_Compra.findAll({
      where: { id_compra: id }
    });
    if (!purchase) {
      return res.status(404).json({ error: 'Pedido no encontrado.' });
    }
    res.json({ purchase, detalle_compra });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el compra.' });
  }
}


// Crear una compra con su detalle y actualizar el stock
async function createShop(req, res) {
  const {
    id_proveedor,
    numero_factura,
    fecha_compra,
    fecha_registrocompra,
    estado_compra,
    observacion_compra,
    productos
  } = req.body;

  try {
    // Validar que se proporciona un ID de proveedor válido
    if (!id_proveedor) {
      return res.status(400).json({ error: 'El ID de proveedor es obligatorio.' });
    }

    // Verificar si el proveedor existe en la base de datos
    const proveedorExistente = await Proveedor.findByPk(id_proveedor);
    if (!proveedorExistente) {
      return res.status(404).json({ error: 'El proveedor no existe en la base de datos.' });
    }

    // Continuar con la creación de la compra
    const nuevaCompra = await Compra.create({
      id_proveedor,
      numero_factura,
      fecha_compra,
      fecha_registrocompra,
      estado_compra,
      observacion_compra,
      total_compra: 0
    });

    // Resto del código para crear el detalle de compra y actualizar stock, precios, etc.

    res.status(201).json({ compra: nuevaCompra, detalle_compra: productos });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error al crear la compra.' });
  }
}


// Editar un compra
async function updateShop(req, res) {
  const { id } = req.params;
  const {  } = req.body;

  if (nombre.length > 100) {
    return res.status(400).json({ error: "El nombre excede la longitud mixima permitida '100' " })
  }

  try {
    const compra = await Compra.findByPk(id);

    if (!compra) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    await compra.update({

    });

    res.json(compra);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el compra.' });
  }
}

// Eliminar un compra
async function deleteShop(req, res) {
  const { id } = req.params;

  try {
    const compra = await Compra.findByPk(id);

    if (!compra) {
      return res.status(404).json({ error: "Pedido no encontrado" })
    }

    await compra.destroy();


    res.status(204).send(compra);
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el compra." })
  }
}

module.exports = {
  getAllShops,
  getShopById,
  createShop,
  updateShop,
  deleteShop
};

// pedidosController.js
const Pedidos = require('../../models/pedidos');
const Detalle_Pedido = require('../../models/detalle_pedido');

// Obtener todos los pedidos
const getAllOrders = async (req, res) => {
  try {
    const pedidos = await Pedidos.findAll();
    if (pedidos.length === 0) {
      return res.status(404).json({ message: "No hay pedidos registrados" })
    }
    res.json(pedidos);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Obtener un pedido por ID
async function getOrderById(req, res) {
  const { id } = req.params;
  try {
    const pedidos = await Pedidos.findByPk(id);
    const detalle_pedido = await Detalle_Pedido.findAll({
      where: { id_pedido: id }
    });
    if (!pedidos) {
      return res.status(404).json({ error: 'Pedido no encontrado.' });
    }
    res.json({ pedidos, detalle_pedido });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el pedido.' });
  }
}

// Crear un pedido
async function createOrder(req, res) {
  const { id_cliente, id_empleado, numero_pedido, fecha_pedido, fecha_entrega, tipo_pago, estado_pedido, productos } = req.body;
  var total_pedido = 0;
  try {
    const nuevoPedido = await Pedidos.create({
      id_cliente,
      id_empleado,
      numero_pedido,
      fecha_pedido,
      fecha_entrega,
      tipo_pago,
      estado_pedido,
      total_pedido
    });
    var id_pedido = nuevoPedido.id_pedido;
    var detalle_pedido = [];
    for (const producto of productos) {
      var id_producto = producto.id_producto;
      var cantidad_producto = producto.cantidad_producto;
      var precio_producto = producto.precio_producto;
      var subtotal = precio_producto * cantidad_producto;
      total_pedido += subtotal;
      const detalle_pedido_prod = await Detalle_Pedido.create({
        id_pedido,
        id_producto,
        cantidad_producto,
        precio_producto
      });
      detalle_pedido.push(detalle_pedido_prod);
    }
    const pedido = await Pedidos.findByPk(id_pedido);
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado.' });
    }
    pedido.total_pedido = total_pedido;
    await pedido.save();
    res.status(201).json({ pedido, detalle_pedido });
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el pedido.' });
    console.log(error.message);
  }
}


// Editar un pedido
async function updateOrder(req, res) {
  const { id } = req.params;
  const { nombre, idcategoria, stock_minimo, cantidad, precio_venta, estado } = req.body;

  if (nombre.length > 100) {
    return res.status(400).json({ error: "El nombre excede la longitud mixima permitida '100' " })
  }

  try {
    const pedido = await Pedidos.findByPk(id);

    if (!pedido) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    await pedido.update({
      nombre,
      idcategoria,
      stock_minimo,
      cantidad,
      precio_venta,
      estado
    });

    res.json(pedido);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el pedido.' });
  }
}

// Eliminar un pedido
async function deleteOrder(req, res) {
  const { id } = req.params;

  try {
    const pedido = await Pedidos.findByPk(id);

    if (!pedido) {
      return res.status(404).json({ error: "Pedido no encontrado" })
    }

    await pedido.destroy();


    res.status(204).send(pedido);
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el pedido." })
  }
}

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
};

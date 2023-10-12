// pedidosController.js
const  Detalle_Pedidos  = require('../../models/detalle_pedido');  

// Obtener un pedido por ID
async function getOrderDetailById(req, res) {
  const { id } = req.params;
  try {
    const pedidos = await Pedidos.findByPk(id);
    if (!pedidos) {
      return res.status(404).json({ error: 'Pedido no encontrado.' });
    }
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el pedido.' });
  }
}

// Crear un pedido
async function createOrderDetail(req, res) {
  const { id_cliente, id_empleado, numero_pedido, fecha_pedido, fecha_entrega, tipo_pago, estado_pedido, total_pedido } = req.body;

  try {
    const pedido = await Pedidos.create({ id_cliente, id_empleado, numero_pedido, fecha_pedido, fecha_entrega, tipo_pago, estado_pedido, total_pedido   });
    res.status(201).json(pedido);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el pedido.' });
    console.log(error.message);
  }
}

// Editar un pedido
async function updateOrder(req, res) {
  const { id } = req.params;
  const {  nombre, idcategoria, stock_minimo, cantidad, precio_venta, estado } = req.body;

  if( nombre.length > 100 ){
    return res.status(400).json({error: "El nombre excede la longitud mixima permitida '100' "})
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

module.exports = {
    getOrderById,
    createOrder,
    updateOrder
};

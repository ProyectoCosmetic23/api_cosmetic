// pedidosController.js
const Pedidos = require('../../models/pedidos');
const Detalle_Pedido = require('../../models/detalle_pedido');
const Ventas = require('../../models/ventas');
const Detalle_Venta = require('../../models/detalle_venta');

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
  const { id_cliente, id_empleado, numero_pedido, fecha_pedido, fecha_entrega, tipo_pago, productos } = req.body;
  var total_pedido = 0;
  var estado_pedido = "Activo";
  var estado_entrega = "En proceso";
  var estado_pago = "Por pagar";
  try {
    const nuevoPedido = await Pedidos.create({
      id_cliente,
      id_empleado,
      numero_pedido,
      fecha_pedido,
      fecha_entrega,
      tipo_pago,
      estado_pedido,
      estado_entrega,
      estado_pago,
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

// Anular un pedido
async function anulateOrderById(req, res) {
  const { id } = req.params;
  var estado_pedido = "Anulado";
  try {
    const pedido = await Pedidos.findByPk(id);
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado.' });
    }
    await pedido.update({
      estado_pedido: estado_pedido
    });
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ error: 'Error al anular el pedido.' });
  }
}

// Actualizar el estado de un pedido
async function updateDeliveryStatusById(req, res) {
  const { id } = req.params;
  try {
    const pedido = await Pedidos.findByPk(id);
    console.log(pedido);
    const detalle_pedido = await Detalle_Pedido.findAll({
      where: { id_pedido: id }
    });
    console.log(detalle_pedido);
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado.' });
    }
    if (pedido.estado_entrega == "Entregado") {
      return res.status(404).json({ error: 'El pedido ya ha sido entregado.' });
    } else {
      if (pedido.estado_entrega == "En proceso") {
        var new_estado_entrega = "Por entregar";
        try {
          const pedido_updated = await pedido.update({
            estado_entrega: new_estado_entrega
          });
          res.json({ pedido_updated })
        } catch (error) {
          console.error('Error al actualizar el estado del pedido:', error);
          res.status(500).json({ error: 'Error al actualizar el estado del pedido.' });
        }
      } else if (pedido.estado_entrega == "Por entregar") {
        var id_pedido = pedido.id_pedido;
        var id_cliente = pedido.id_cliente;
        var id_empleado = pedido.id_empleado;
        var numero_factura = pedido.numero_pedido;
        var fecha_venta = pedido.fecha_pedido;
        var estado_pago = pedido.estado_pago;
        var estado_venta = "Activo";
        var tipo_pago = pedido.tipo_pago;
        var total_venta = pedido.total_pedido;
        try {
          const nueva_Venta = await Ventas.create({
            id_pedido,
            id_cliente,
            id_empleado,
            numero_factura,
            fecha_venta,
            estado_pago,
            estado_venta,
            tipo_pago,
            total_venta
          });
          var id_venta = nueva_Venta.id_venta;
          var lista_detalle_venta = []
          for (const producto of detalle_pedido) {
            var id_producto = producto.id_producto;
            var cantidad = producto.cantidad_producto;
            var precio_producto = producto.precio_producto;
            const nuevo_Detalle_Venta = await Detalle_Venta.create({
              id_venta,
              id_producto,
              cantidad,
              precio_producto,
            })
            lista_detalle_venta.push(nuevo_Detalle_Venta);
          }
          try {
            const pedido_updated = await pedido.update({
              estado_entrega: "Entregado"
            });
            res.json({ nueva_Venta, lista_detalle_venta, pedido_updated });
          } catch (error) {
            console.error('Error al cambiar el estado del pedido:', error);
            res.status(500).json({ error: 'Error al cambiar el estado del pedido' });
          }
        } catch (error) {
          res.status(500).json({ error: 'Error al enviar el pedido a la sección de ventas.' });
        }
      }
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el pedido.' });
  }
}

// Exportar las funciones del módulo
module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  anulateOrderById,
  updateDeliveryStatusById
};



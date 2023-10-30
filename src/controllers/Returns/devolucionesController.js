const Venta = require('../../models/sales');
const Producto = require('../../models/products');
const Devolucion = require('../../models/returns');

const crearDevolucion = async (req, res) => {
  const { id_venta, id_producto, cantidad, motivo } = req.body;

  try {
    const venta = await Venta.findByPk(id_venta, { include: Producto });
    if (!venta) {
      return res.status(404).json({ error: 'Venta no encontrada.' });
    }

    const producto = venta.productos.find((p) => p.id === id_producto);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado en la venta.' });
    }

    if (cantidad > producto.quantity) {
      return res.status(400).json({ error: 'La cantidad a devolver supera la cantidad disponible del producto.' });
    }

    // Realizar la devolución
    const nuevaDevolucion = {
      id_venta,
      id_producto,
      return_date: new Date(),
      return_quantity: cantidad,
      return_value: producto.selling_price * cantidad,
      motivo_devolucion: motivo,
    };

    await Devolucion.create(nuevaDevolucion);

    // Actualizar la cantidad de productos y la cantidad total de productos
    producto.quantity -= cantidad;
    await producto.save();

    venta.total_sale -= nuevaDevolucion.return_value;
    await venta.save();

    res.json({ message: 'Devolución creada exitosamente.' });
  } catch (error) {
    console.error('Error al crear la devolución:', error);
    res.status(500).json({ error: 'Error interno del servidor al crear la devolución.' });
  }
};



module.exports = {
  crearDevolucion,

};

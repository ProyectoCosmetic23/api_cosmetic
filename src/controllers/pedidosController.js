// pedidosController.js
const  Pedidos  = require('../models/Pedidos');  
const  PedidosDetail = require('../models/PedidosDetail');

const getAllOrders = async (req, res) => {
  try {
    const pedidos = await Pedidos.findAll();  

    if (pedidos.length === 0 ){
      return res.status(404).json({message: "No hay pedidos registrados"})
    }
    res.json(pedidos);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Obtener un producto por ID
async function getOrderById(req, res) {
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

async function createOrder(req, res) {
  const { id_cliente, id_empleado, numero_pedido, fecha_pedido, fecha_entrega, tipo_pago, estado_pedido, total_pedido } = req.body;

  try {
   
    const pedido = await Pedidos.create({ id_cliente, id_empleado, numero_pedido, fecha_pedido, fecha_entrega, tipo_pago, estado_pedido, total_pedido   });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el producto.' });
    console.log(error.message);
  }
}

async function updateProduct(req, res) {
  const { id } = req.params;
  const {  nombre, idcategoria, stock_minimo, cantidad, precio_venta, estado } = req.body;

  if( nombre.length > 100 ){
    return res.status(400).json({error: "El nombre excede la longitud mixima permitida '100' "})
  }

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    // Actualiza los campos del producto
    await product.update({
      nombre,
      idcategoria,
      stock_minimo,
      cantidad,
      precio_venta,
      estado
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto.' });
  }
}

async function deleteProduct(req, res) {
  const { id } = req.params;

  try{
    const product= await Product.findByPk(id);

    if(!product){
      return res.status(404).json({error: "Producto no encontrado"})
    }

    await product.destroy();


    res.status(204).send(product);
  }catch(error){
    res.status(500).json({error : "Error al eliminar el producto."})
  }
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};

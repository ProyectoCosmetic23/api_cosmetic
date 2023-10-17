//ProductosController.js
const Producto = require ('../../models/productos');

//Consultar todos los productos

const getAllProducts = async (req, res) => {
  try {
    const productos = await Producto.findAll();
    if (productos.length === 0) {
      return res.status(404).json({ message: "No hay productos registrados" })
    }
    res.json(productos);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Obtener el id de un producto

async function getProductsById(req, res) {
  const { id } = req.params;
  try {
    const productos = await Productos.findByPk(id);
    if (!productos) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto.' });
  }
}

//Crear un producto

async function createProducts(req, res) {
  const {
    id_categoria,
    nombre_producto,
    cantidad,
    stock_maximo,
    stock_minimo,
    precio_costo,
    precio_venta,
    observacion,
  } = req.body;

  // Calcular la ganancia
  const ganancia = precio_venta - precio_costo;

  // Establecer el valor por defecto para estado_producto en "activo"
  const estado_producto = "Activo";

  // Obtener la fecha y hora actual
  const fecha_creacion_producto = new Date();
  fecha_creacion_producto.setDate(fecha_creacion_producto.getDate() - 1); // Resta un día
  fecha_creacion_producto.setHours(fecha_creacion_producto.getHours() + 2); // Suma 2 horas

  try {
    const nuevoProducto = await Producto.create({
      id_categoria,
      nombre_producto,
      cantidad,
      stock_maximo,
      stock_minimo,
      precio_costo,
      precio_venta,
      ganancia,
      fecha_creacion_producto,
      estado_producto,
      observacion
    });

    res.json(nuevoProducto);
  } catch (error) {
    console.error("Error al crear el producto:", error);
    res.status(400).json({ error: 'Error al crear el producto.' });
  }
}


//Modificar un producto
const productsPut = async (req, res) => {
  const { id } = req.params; // El ID del producto
  const { id_categoria, nombre_producto, stock_maximo, stock_minimo, precio_venta, observacion } = req.body;
  let mensaje = '';

  try {
      if (id) {
          // Buscar el producto por su ID
          const producto = await Producto.findByPk(id);

          if (producto) {
              // Guardar el precio de costo original antes de actualizar el precio de venta
              const precio_costo_original = producto.precio_costo;

              // Actualizar los campos del producto
              producto.id_categoria = id_categoria;
              producto.nombre_producto = nombre_producto;
              producto.stock_maximo = stock_maximo;
              producto.stock_minimo = stock_minimo;
              producto.precio_venta = precio_venta;
              producto.observacion = observacion;

              // Calcular la nueva ganancia
              producto.ganancia = precio_venta - precio_costo_original;

              // Guardar los cambios en la base de datos
              await producto.save();

              mensaje = "La modificación se efectuó correctamente";
          } else {
              mensaje = "El producto no fue encontrado";
          }
      } else {
          mensaje = "Falta el ID en la solicitud";
      }
  } catch (error) {
      console.error("Error al guardar el producto:", error);
      mensaje = "Ocurrió un error al actualizar el producto: " + error.message;
  }

  res.json({
      msg: mensaje
  });
};




//cambiar estado del producto
const productsChangeStatus = async (req, res) => {
  const { id } = req.params; // El ID del producto
  const { estado_producto} = req.body;
  let mensaje = '';

  try {
      if (id) {
          // Buscar el producto por su ID
          const producto = await Producto.findByPk(id);

          if (producto) {
              // Actualizar los campos del producto
              producto.estado_producto = estado_producto;
              

              // Guardar los cambios en la base de datos
              await producto.save();

              mensaje = "La modificación se efectuó correctamente";
          } else {
              mensaje = "El producto no fue encontrada";
          }
      } else {
          mensaje = "Falta el ID en la solicitud";
      }
  } catch (error) {
    console.error("Error al guardar el producto:", error);
    mensaje = "Ocurrió un error al actualizar el producto: " + error.message;
}

  res.json({
      msg: mensaje
  });
};



//Exportar los metodos del producto

module.exports = {
  getAllProducts,
  getProductsById,
  createProducts,
  productsPut,
  productsChangeStatus
};
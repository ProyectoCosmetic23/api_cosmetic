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

  // Validación: Verifica que los campos obligatorios no estén vacíos
  if (!id_categoria || !nombre_producto || !cantidad || !stock_maximo || !stock_minimo || !precio_costo || !precio_venta) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  if (isNaN(cantidad) || cantidad <= 0) {
    return res.status(400).json({ error: 'La cantidad debe ser un número mayor que cero' });
  }

  // Validación: Precio de costo y precio de venta deben ser numéricos y mayores que cero
  if (isNaN(precio_costo) || isNaN(precio_venta) || precio_costo <= 0 || precio_venta <= 0) {
    return res.status(400).json({ error: 'El precio de costo y el precio de venta deben ser numéricos y mayores que cero' });
  }

  // Validación: Stock máximo y stock mínimo deben ser números enteros y stock máximo debe ser mayor que stock mínimo
  if (!Number.isInteger(stock_maximo) || !Number.isInteger(stock_minimo) || stock_maximo <= stock_minimo) {
    return res.status(400).json({ error: 'El stock máximo y el stock mínimo deben ser números enteros, y el stock máximo debe ser mayor que el stock mínimo' });
  }

  // Validación: Nombre debe contener solo letras y espacios
  if (!/^[A-Za-z0-9\s]+$/.test(nombre_producto)) {
    return res.status(400).json({ error: 'El nombre debe contener letras, números y espacios' });
  }

  // Calcular la ganancia
  const ganancia = precio_venta - precio_costo;

  const fecha_creacion_producto = new Date();

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
      observacion
    });

    res.json(nuevoProducto);
  } catch (error) {
    console.error("Error al crear el producto:", error);
    res.status(400).json({ error: 'Error al crear el producto.' });
  }
}


//Modificar un producto
async function productsPut(req, res) {
  const { id } = req.params; // El ID del producto
  const { id_categoria, nombre_producto, stock_maximo, stock_minimo, precio_venta, observacion } = req.body;
  let mensaje = '';

  
 // Validación: Nombre debe contener letras, números y espacios
if (!/^[A-Za-z0-9\s]+$/.test(nombre_producto)) {
  return res.status(400).json({ error: 'El nombre debe contener letras, números y espacios' });
}

  // Validación: Verifica que los campos obligatorios no estén vacíos
  if (!id_categoria || !nombre_producto || !stock_maximo || !stock_minimo || !precio_venta) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  // Validación: Precio de venta debe ser numérico y mayor que cero
  if (isNaN(precio_venta) || precio_venta <= 0) {
    return res.status(400).json({ error: 'El precio de venta debe ser numérico y mayor que cero' });
  }

  // Validación: Stock máximo y stock mínimo deben ser números enteros y stock máximo debe ser mayor que stock mínimo
  if (!Number.isInteger(stock_maximo) || !Number.isInteger(stock_minimo) || stock_maximo <= stock_minimo) {
    return res.status(400).json({ error: 'El stock máximo y el stock mínimo deben ser números enteros, y el stock máximo debe ser mayor que el stock mínimo' });
  }

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

        // Validación: Precio de venta debe ser numérico y mayor que cero
        if (!isNaN(precio_venta) && precio_venta > 0) {
          // Calcular la nueva ganancia
          producto.ganancia = precio_venta - precio_costo_original;

          // Guardar los cambios en la base de datos
          await producto.save();

          mensaje = "La modificación se efectuó correctamente";
        } else {
          mensaje = "El precio de venta debe ser numérico y mayor que cero";
        }
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
}





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

              mensaje = "Se cambio el estado correctamente";
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



//Exportar los metodos del producto

module.exports= {
  getAllProducts,
  getProductsById,
  createProducts,
  productsPut,
  productsChangeStatus
};
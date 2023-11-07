//ProductosController.js
const Product = require('../../models/products');

//Consultar todos los productos

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    if (products.length === 0) {
      return res.status(404).json({ message: "No hay productos registrados" })
    }
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Obtener el id de un producto

async function getProductsById(req, res) {
  const { id } = req.params;
  console.log('ID ', id)
  try {
    const products = await Product.findByPk(id);
    if (!products) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto.' });
  }
}

//Crear un producto

async function createProducts(req, res) {
  const {
    id_category,
    name_product,
    quantity,
    max_stock,
    min_stock,
    cost_price,
    selling_price,
    observation,
  } = req.body;

  // Validación: Verifica que los campos obligatorios no estén vacíos
  if (!id_category || !name_product || !quantity || !max_stock || !min_stock || !cost_price || !selling_price) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  if (isNaN(quantity) || quantity <= 0) {
    return res.status(400).json({ error: 'La cantidad debe ser un número mayor que cero' });
  }

  // Validación: Precio de costo y precio de venta deben ser numéricos y mayores que cero
  if (isNaN(cost_price) || isNaN(selling_price) || cost_price <= 0 || selling_price <= 0) {
    return res.status(400).json({ error: 'El precio de costo y el precio de venta deben ser numéricos y mayores que cero' });
  }

  // Validación: Stock máximo y stock mínimo deben ser números enteros y stock máximo debe ser mayor que stock mínimo
  if (!Number.isInteger(max_stock) || !Number.isInteger(min_stock) || max_stock <= min_stock) {
    return res.status(400).json({ error: 'El stock máximo y el stock mínimo deben ser números enteros, y el stock máximo debe ser mayor que el stock mínimo' });
  }

  // Validación: Nombre debe contener solo letras y espacios
  if (!/^[A-Za-z0-9\s]+$/.test(name_product)) {
    return res.status(400).json({ error: 'El nombre debe contener letras, números y espacios' });
  }

  // Calcular la ganancia
  const profit = selling_price - cost_price;


  try {
    const newProduct = await Product.create({
      id_category,
      name_product,
      quantity,
      max_stock,
      min_stock,
      cost_price,
      selling_price,
      profit,
      observation
    });

    res.json(newProduct);
  } catch (error) {
    console.error("Error al crear el producto:", error);
    res.status(400).json({ error: 'Error al crear el producto.' });
  }
}


//Modificar un producto
async function productsPut(req, res) {
  const { id } = req.params; // El ID del producto
  const { id_category, name_product, max_stock, min_stock, selling_price, observation } = req.body;
  let mensaje = '';


  // Validación: Nombre debe contener letras, números y espacios
  if (!/^[A-Za-z0-9\s]+$/.test(name_product)) {
    return res.status(400).json({ error: 'El nombre debe contener letras, números y espacios' });
  }

  // Validación: Verifica que los campos obligatorios no estén vacíos
  if (!id_category || !name_product || !max_stock || !min_stock || !selling_price) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  // Validación: Precio de venta debe ser numérico y mayor que cero
  if (isNaN(selling_price) || selling_price <= 0) {
    return res.status(400).json({ error: 'El precio de venta debe ser numérico y mayor que cero' });
  }

  // Validación: Stock máximo y stock mínimo deben ser números enteros y stock máximo debe ser mayor que stock mínimo
  if (!Number.isInteger(max_stock) || !Number.isInteger(min_stock) || max_stock <= min_stock) {
    return res.status(400).json({ error: 'El stock máximo y el stock mínimo deben ser números enteros, y el stock máximo debe ser mayor que el stock mínimo' });
  }

  try {
    if (id) {
      // Buscar el producto por su ID
      const product = await Product.findByPk(id);

      if (product) {
        // Guardar el precio de costo original antes de actualizar el precio de venta
        const cost_price_original = product.cost_price;

        // Actualizar los campos del producto
        product.id_category = id_category;
        product.name_product = name_product;
        product.max_stock = max_stock;
        product.min_stock = min_stock;
        product.selling_price = selling_price;
        product.observation = observation;

        // Validación: Precio de venta debe ser numérico y mayor que cero
        if (!isNaN(selling_price) && selling_price > 0) {
          // Calcular la nueva ganancia
          product.profit = selling_price - cost_price_original;

          // Guardar los cambios en la base de datos
          await product.save();

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
async function productsChangeStatus(req, res) {
  const { id } = req.params;
  let mensaje = '';

  try {
    if (id) {
      // Buscar el empleado por su ID
      const product = await Product.findByPk(id);

      if (product) {
        var state_product_new = "";

        if (product.state_product === "Activo") {
          state_product_new = "Inactivo";
        } else if (product.state_product === "Inactivo") {
          state_product_new = "Activo";
        }

        // Actualizar el estado del empleado
        product.state_product = state_product_new;

        mensaje = "Cambio de estado realizado con éxito.";
      } else {
        mensaje = "El producto no fue encontrado.";
      }
    } else {
      mensaje = "Falta el ID en la solicitud.";
    }
  } catch (error) {
    console.error("Error al cambiar el estado del empleado:", error);
    mensaje = "Fallo al realizar el cambio de estado: " + error.message;
  }
  res.json({
    msg: mensaje
  });
}



//Exportar los metodos del producto

module.exports = {
  getAllProducts,
  getProductsById,
  createProducts,
  productsPut,
  productsChangeStatus
};
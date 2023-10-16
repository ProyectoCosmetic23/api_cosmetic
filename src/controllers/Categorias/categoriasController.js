//CategoriasController.js
const Categoria = require ('../../models/categorias_productos');

//Consultar todas la categoria

const getAllCategories = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    if (categorias.length === 0) {
      return res.status(404).json({ message: "No hay categorias registradas" })
    }
    res.json(categorias);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Obtener el id de una  categoria

async function getCategoryById(req, res) {
  const { id } = req.params;
  try {
    const categorias = await Categoria.findByPk(id);
    if (!categorias) {
      return res.status(404).json({ error: 'Categoria no encontrada.' });
    }
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la categoria.' });
  }
}

//Crear una categoria

async function createCategory(req, res) {
  const { nombre_categoria, observacion_categoria, fecha_creacion_categoria } = req.body;
  try {
    const nuevaCategoria = await Categoria.create({
      nombre_categoria,
      observacion_categoria,
      fecha_creacion_categoria
    });
    res.json(nuevaCategoria);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear la categoria.' });
  }
}

//Modificar una categoria
const categoryPut = async (req, res) => {
    const { id } = req.params; // El ID de la categoría se obtiene de los parámetros de la URL
    const { nombre_categoria, estado_categoria,
         observacion_categoria } = req.body;
    let mensaje = '';

    try {
        if (id) {
            // Buscar la categoría por su ID
            const categoria = await Categoria.findByPk(id);

            if (categoria) {
                // Actualizar los campos de la categoría
                categoria.nombre_categoria = nombre_categoria;
                categoria.estado_categoria = estado_categoria;
                categoria.observacion_categoria = observacion_categoria;

                // Guardar los cambios en la base de datos
                await categoria.save();

                mensaje = "La modificación se efectuó correctamente";
            } else {
                mensaje = "La categoría no fue encontrada";
            }
        } else {
            mensaje = "Falta el ID en la solicitud";
        }
    } catch (error) {
        console.error(error);
        mensaje = "Ocurrió un error al actualizar la categoría: " + error.message;
    }

    res.json({
        msg: mensaje
    });
};


const categoriaDelete = async (req, res) => {
    const { id } = req.params; // El ID de la categoría se obtiene de los parámetros de la URL
    let mensaje = '';

    try {
        if (id) {
            // Buscar la categoría por su ID
            const categoria = await Categoria.findByPk(id);

            if (categoria) {
                // Eliminar la categoría
                await categoria.destroy();

                mensaje = "La eliminación se efectuó exitosamente.";
            } else {
                mensaje = "La categoría no fue encontrada";
            }
        } else {
            mensaje = "Falta el ID en la solicitud";
        }
    } catch (error) {
        console.error(error);
        mensaje = "Ocurrió un error al eliminar la categoría: " + error.message;
    }

    res.json({
        msg: mensaje
    });
};
//Exportar los metodos de la categoria

const CategoryChangeStatus = async (req, res) => {
    const { id } = req.params; // El ID de la categoría se obtiene de los parámetros de la URL
    const { nuevoEstado } = req.body; // El nuevo estado se obtiene del cuerpo de la solicitud
    let mensaje = '';

    try {
        if (id && nuevoEstado) {
            // Buscar la categoría por su ID
            const categoria = await Categoria.findByPk(id);

            if (categoria) {
                // Actualizar el estado de la categoría
                categoria.estado_categoria = nuevoEstado;
                await categoria.save();

                mensaje = "El estado de la categoría se actualizó correctamente.";
            } else {
                mensaje = "La categoría no fue encontrada";
            }
        } else {
            mensaje = "Falta el ID o el nuevo estado en la solicitud";
        }
    } catch (error) {
        console.error(error);
        mensaje = "Ocurrió un error al cambiar el estado de la categoría: " + error.message;
    }

    res.json({
        msg: mensaje
    });
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  categoryPut,
  categoriaDelete,
  CategoryChangeStatus
};



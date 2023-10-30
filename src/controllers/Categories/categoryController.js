//CategorysController.js
const Category = require ('../../models/product_categories');

//Consultar todas la category

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    if (categories.length === 0) {
      throw new Error('No se encontraron categorías registradas.');
    }
    res.json(categories);
  } catch (error) {
    console.error('Error al recuperar las categorías:', error);
    next(error);
  }
};


// Obtener el id de una  category

async function getCategoryById(req, res, next) {
  const { id } = req.params;
  try {
    const categories = await Category.findByPk(id);
    if (!categories) {
      throw new Error('La categoría no fue encontrada.');
    }
    res.json(categories);
  } catch (error) {
    next(error);
  }
}


//Crear una category
async function createCategory(req, res, next) {
  const { name_category, observation_category } = req.body;
  
  try {
    if (/^[A-Za-záéíóúÁÉÍÓÚüÜ\s]+$/.test(name_category)) {
      throw new Error("El nombre de la category solo debe contener letras y espacios");
    }
    else if (!name_category) {
      throw new Error("Falta el nombre de la category");
    }
    
    const category = await Category.findOne({ where: { name_category } });
    if (category) {
      throw new Error("Ya existe una category con ese nombre");
    }
    
    if (observation_category.length > 100) {
      throw new Error("La observación no puede tener más de 100 caracteres");
    }

    const newCategory = await Category.create({
      name_category,
      observation_category
    });

    res.json(newCategory);
  } catch (error) {
    next(error); // En lugar de usar res.status(400).json({ error: 'Error al crear la category.' });
  }
}


//Modificar una category
const categoryPut = async (req, res, next) => {
  const { id } = req.params; // El ID de la categoría se obtiene de los parámetros de la URL
  const { name_category, state_category, observation_category } = req.body;
  let message = '';

  try {
    // Validaciones
    if (!name_category) {
      throw new Error("Falta el nombre de la categoría");
    }
    
    if (!/^[A-Za-záéíóúÁÉÍÓÚüÜ\s]+$/.test(name_category)) {
      throw new Error("El nombre de la categoría solo debe contener letras y espacios");
    }
    
    if (observation_category.length > 100) {
      throw new Error("La observación no puede tener más de 100 caracteres");
    }
    
    const categoryExisting = await Category.findOne({ where: { name_category } });
    if (categoryExisting && categoryExisting.id !== id) {
      throw new Error("Ya existe una categoría con ese nombre");
    }

    if (id) {
      // Buscar la categoría por su ID
      const category = await Category.findByPk(id);

      if (category) {
        // Actualizar los campos de la categoría
        category.name_category = name_category;
        category.state_category = state_category;
        category.observation_category = observation_category;

        // Guardar los cambios en la base de datos
        await category.save();

        message = "La modificación se efectuó correctamente";
      } else {
        message = "La categoría no fue encontrada";
      }
    } else {
      message = "Falta el ID en la solicitud";
    }
  } catch (error) {
    console.error(error);
    message = "Ocurrió un error al actualizar la categoría: " + error.message;
  }

  res.json({ msg: message });
};



const CategoryChangeStatus = async (req, res) => {
    const { id } = req.params; // El ID de la categoría se obtiene de los parámetros de la URL
    const { newState } = req.body; // El nuevo estado se obtiene del cuerpo de la solicitud
    let message = '';

    try {
        if (id && newState) {
            // Buscar la categoría por su ID
            const category = await Category.findByPk(id);

            if (category) {
                // Actualizar el estado de la categoría
                category.state_category = newState;
                await category.save();

                message = "El estado de la categoría se actualizó correctamente.";
            } else {
                message = "La categoría no fue encontrada";
            }
        } else {
            message = "Falta el ID o el nuevo estado en la solicitud";
        }
    } catch (error) {
        console.error(error);
        message = "Ocurrió un error al cambiar el estado de la categoría: " + error.message;
    }

    res.json({
        msg: message
    });
};



//Exportar los metodos de la category

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  categoryPut,

  CategoryChangeStatus
};



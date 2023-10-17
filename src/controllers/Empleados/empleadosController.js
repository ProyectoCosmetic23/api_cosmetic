//EmpleadosController.js
const Empleado = require ('../../models/empleados');

//Consultar todas los empleados

const getAllEmployes = async (req, res) => {
  try {
    const empleados = await Empleado.findAll();
    if (empleados.length === 0) {
      return res.status(404).json({ message: "No hay empleados registrados" })
    }
    res.json(empleados);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Obtener el id de un empleado

async function getEmployesById(req, res) {
  const { id } = req.params;
  try {
    const empleados = await Empleado.findByPk(id);
    if (!empleados) {
      return res.status(404).json({ error: 'Empleado no encontrado.' });
    }
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el empleado.' });
  }
}

//Crear un empleado

async function createEmploye(req, res) {
  const {
    cedula_empleado,
    nombre_empleado,
    correo,
    direccion,
    telefono,
    observacion,
  } = req.body;
  
  // Establecer el valor por defecto para estado_empleado en "activo"
  const estado_empleado = "Activo";

  // Obtener la fecha y hora actual
  const fecha_creacion_empleado = new Date();
  fecha_creacion_empleado.setDate(fecha_creacion_empleado.getDate() - 1); // Resta un día
  fecha_creacion_empleado.setHours(fecha_creacion_empleado.getHours() + 2); // Suma 2 horas
  


  try {
    const nuevoEmpleado = await Empleado.create({
      cedula_empleado,
      nombre_empleado,
      correo,
      direccion,
      telefono,
      estado_empleado,
      observacion,
      fecha_creacion_empleado,
    });
    res.json(nuevoEmpleado);
  } catch (error) {
    console.error("Error al crear el empleado:", error);
    res.status(400).json({ error: 'Error al crear el empleado.' });
  }
}

//Modificar un empleado
const employePut = async (req, res) => {
    const { id } = req.params; // El ID del empleado
    const { nombre_empleado,correo,direccion,telefono,
            observacion } = req.body;
    let mensaje = '';

    try {
        if (id) {
            // Buscar el empleado por su ID
            const empleado = await Empleado.findByPk(id);

            if (empleado) {
                // Actualizar los campos del empleado
                empleado.nombre_empleado = nombre_empleado;
                empleado.correo = correo;
                empleado.direccion = direccion;
                empleado.telefono = telefono;
                empleado.observacion = observacion;

                // Guardar los cambios en la base de datos
                await empleado.save();

                mensaje = "La modificación se efectuó correctamente";
            } else {
                mensaje = "El empleado no fue encontrada";
            }
        } else {
            mensaje = "Falta el ID en la solicitud";
        }
    } catch (error) {
      console.error("Error al guardar el empleado:", error);
      mensaje = "Ocurrió un error al actualizar el empleado: " + error.message;
  }

    res.json({
        msg: mensaje
    });
};



//cambiar estado del empleado
const employeChangeStatus = async (req, res) => {
  const { id } = req.params; // El ID del empleado
  const { estado_empleado} = req.body;
  let mensaje = '';

  try {
      if (id) {
          // Buscar el empleado por su ID
          const empleado = await Empleado.findByPk(id);

          if (empleado) {
              // Actualizar los campos del empleado
              empleado.estado_empleado = estado_empleado;
              

              // Guardar los cambios en la base de datos
              await empleado.save();

              mensaje = "La modificación se efectuó correctamente";
          } else {
              mensaje = "El empleado no fue encontrada";
          }
      } else {
          mensaje = "Falta el ID en la solicitud";
      }
  } catch (error) {
    console.error("Error al guardar el empleado:", error);
    mensaje = "Ocurrió un error al actualizar el empleado: " + error.message;
}

  res.json({
      msg: mensaje
  });
};



//Exportar los metodos del empleado

module.exports = {
  getAllEmployes,
  getEmployesById,
  createEmploye,
  employePut,
  employeChangeStatus
};
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

// Función para verificar si el correo es válido
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
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

  // Validación: Verifica que los campos obligatorios no estén vacíos
  if (!cedula_empleado || !nombre_empleado || !correo || !direccion || !telefono) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  // Validación: Cédula debe ser numérica
  if (!/^\d{10}$/.test(cedula_empleado)) {
    return res.status(400).json({ error: 'La cédula debe ser numérica y tener 10 dígitos' });
  }

  // Validación: Nombre debe contener letras, números, espacios y el símbolo "~" para la "ñ"
if (!/^[A-Za-z0-9\s~ñÑ]+$/.test(nombre_producto)) {
  return res.status(400).json({ error: 'El nombre debe contener letras, números, espacios y el símbolo "~" para la "ñ"' });
}


  // Validación: Correo debe ser válido
  if (!isValidEmail(correo)) {
    return res.status(400).json({ error: 'El correo no es válido' });
  }

  // Validación: Teléfono debe ser numérico
  if (!/^\d{10}$/.test(telefono)) {
    return res.status(400).json({ error: 'El teléfono debe ser numérico y tener 10 dígitos' });
  }

  try {
    const correoExistente = await Empleado.findOne({ where: { correo } });

    if (correoExistente) {
      return res.status(400).json({ error: "El correo ya está en uso." });
    }

    const nuevoEmpleado = await Empleado.create({
      cedula_empleado,
      nombre_empleado,
      correo,
      direccion,
      telefono,
      observacion,
    });

    res.json(nuevoEmpleado);
  } catch (error) {
    console.error('Error al crear el empleado:', error);
    res.status(500).json({ error: 'Error al crear el empleado. Detalles: ' + error.message });
  }
}

//Modificar un empleado
async function employePut(req, res) {
  const { id } = req.params; // El ID del empleado
  const { nombre_empleado, correo, direccion, telefono, observacion } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Falta el ID en la solicitud' });
  }

  // Validación: El nombre debe contener letras, números, espacios y el símbolo "~" para la "ñ"
  if (nombre_empleado && !/^[A-Za-z0-9\s~ñÑ]+$/.test(nombre_empleado)) {
    return res.status(400).json({ error: 'El nombre debe contener letras, números, espacios y el símbolo "~" para la "ñ"' });
  }
  
  

  // Validación: Correo debe ser válido
  if (correo && !isValidEmail(correo)) {
    return res.status(400).json({ error: 'El correo no es válido' });
  }

  // Validación: Teléfono debe ser numérico
  if (telefono && !/^\d{10}$/.test(telefono)) {
    return res.status(400).json({ error: 'El teléfono debe ser numérico y tener 10 dígitos' });
  }

  try {
    // Buscar el empleado por su ID
    const empleado = await Empleado.findByPk(id);

    if (!empleado) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    // Validar que al menos un campo a modificar esté presente
    if (nombre_empleado || correo || direccion || telefono || observacion) {
      // Actualizar los campos del empleado
      if (nombre_empleado) empleado.nombre_empleado = nombre_empleado;
      if (correo) empleado.correo = correo;
      if (direccion) empleado.direccion = direccion;
      if (telefono) empleado.telefono = telefono;
      if (observacion) empleado.observacion = observacion;

      // Guardar los cambios en la base de datos
      await empleado.save();

      return res.json({ msg: 'La modificación se efectuó correctamente' });
    } else {
      return res.status(400).json({ error: 'Ningún campo a modificar proporcionado' });
    }
  } catch (error) {
    console.error('Error al guardar el empleado:', error);
    return res.status(500).json({ error: 'Ocurrió un error al actualizar el empleado: ' + error.message });
  }
}



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

              mensaje = "Se cambio el estado correctamente";
          } else {
              mensaje = "El empleado no fue encontrado";
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

module.exports= {
  getAllEmployes,
  getEmployesById,
  createEmploye,
  employePut,
  employeChangeStatus
};
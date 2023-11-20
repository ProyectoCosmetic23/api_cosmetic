//EmpleadosController.js
const Employee = require ('../../models/employees');

//Consultar todas los empleados
const getAllEmployees = async (req, res) => {
  try {

    const employees = await Employee.findAll();
    if (employees.length === 0) {
      return res.status(404).json({ message: "No hay empleados registrados" })
    }
    res.json(employees);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Obtener el id de un empleado

async function getEmployeesById(req, res) {
  const { id } = req.params;
  try {
    const employees = await Employee.findByPk(id);
    if (!employees) {
      return res.status(404).json({ error: 'Empleado no encontrado.' });
    }
    res.json(employees);
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

async function createEmployee(req, res) {
  const {
    id_card_employee,
    name_employee,
    email,
    address,
    phone,
    observation,
  } = req.body;

  // Validación: Verifica que los campos obligatorios no estén vacíos
  if (!id_card_employee || !name_employee || !email || !address || !phone) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  // Validación: Cédula debe ser numérica
  if (!/^\d{10}$/.test(id_card_employee)) {
    return res.status(400).json({ error: 'La cédula debe ser numérica y tener 10 dígitos' });
  }

  // Validación: Nombre debe contener letras, números, espacios y el símbolo "~" para la "ñ"
  if (!/^[A-Za-z0-9\s~ñÑ]+$/.test(name_employee)) {
    return res.status(400).json({ error: 'El nombre debe contener letras, números, espacios y el símbolo "~" para la "ñ"' });
  }

  // Validación: Correo debe ser válido
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'El correo no es válido' });
  }

  // Validación: Teléfono debe ser numérico
  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).json({ error: 'El teléfono debe ser numérico y tener 10 dígitos' });
  }

  
    const newEmployee = await Employee.create({
      id_card_employee,
      name_employee,
      email,
      address,
      phone,
      observation,
    });

    res.json(newEmployee);
  }  (error) =>{
    console.error('Error al crear el empleado:', error);
    res.status(500).json({ error: 'Error al crear el empleado. Detalles: ' + error.message });
  }


  async function checkCedulaAvailability(req, res) {
    const { cedula } = req.query;
    try {
      const existingCedula = await Employee.findOne({ where: { id_card_employee: cedula } });
      res.json(!existingCedula);
    } catch (error) {
      console.error('Error al verificar la cédula:', error);
      res.status(500).json({ error: 'Error al verificar la cédula.' });
    }
  }

  async function checkEmailAvailability(req, res) {
    const { email } = req.query;
    try {
      const existingEmail = await Employee.findOne({ where: { email } });
      res.json(!existingEmail);
    } catch (error) {
      console.error('Error al verificar el correo:', error);
      res.status(500).json({ error: 'Error al verificar el correo.' });
    }
  }
 
//Modificar un empleado
async function employeePut(req, res) {
  const { id } = req.params; // El ID del empleado
  const { name_employee, email, address, phone, observation } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Falta el ID en la solicitud' });
  }

  // Validación: El nombre debe contener letras, números, espacios y el símbolo "~" para la "ñ"
  if (name_employee && !/^[A-Za-z0-9\s~ñÑ]+$/.test(name_employee)) {
    return res.status(400).json({ error: 'El nombre debe contener letras, números, espacios y el símbolo "~" para la "ñ"' });
  }
  
  

  // Validación: Correo debe ser válido
  if (email && !isValidEmail(email)) {
    return res.status(400).json({ error: 'El correo no es válido' });
  }

  // Validación: Teléfono debe ser numérico
  if (phone && !/^\d{10}$/.test(phone)) {
    return res.status(400).json({ error: 'El teléfono debe ser numérico y tener 10 dígitos' });
  }

  try {
    // Buscar el empleado por su ID
    const employee = await Employee.findByPk(id);

    if (!employee) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    // Validar que al menos un campo a modificar esté presente
    if (name_employee || email || address || phone || observation) {
      // Actualizar los campos del empleado
      if (name_employee) employee.name_employee = name_employee;
      if (email) employee.email = email;
      if (address) employee.address = address;
      if (phone) employee.phone = phone;
      if (observation) employee.observation = observation;

      // Guardar los cambios en la base de datos
      await employee.save();

      return res.json({ msg: 'La modificación se efectuó correctamente' });
    } else {
      return res.status(400).json({ error: 'Ningún campo a modificar proporcionado' });
    }
  } catch (error) {
    console.error('Error al guardar el empleado:', error);
    return res.status(500).json({ error: 'Ocurrió un error al actualizar el empleado: ' + error.message });
  }
}



// Cambiar estado del empleado
async function employeeChangeStatus(req, res) {
  const { id } = req.params;
 
  let mensaje = '';

  try {
      if (id) {
          // Buscar el empleado por su ID
          const employee = await Employee.findByPk(id);

          if (employee) {
              var state_employee_new = "";

              if (employee.state_employee === "Activo") {
                  state_employee_new = "Inactivo";
              } else if (employee.state_employee === "Inactivo") {
                  state_employee_new = "Activo";
              }
              // Actualizar el estado del empleado
              employee.state_employee = state_employee_new;

              // Guardar los cambios en la base de datos
              await employee.save();

              mensaje = "Cambio de estado realizado con éxito.";
          } else {
              mensaje = "El empleado no fue encontrado.";
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


module.exports= {
  getAllEmployees,
  getEmployeesById,
  createEmployee,
  employeePut,
  employeeChangeStatus,
  checkCedulaAvailability,
  checkEmailAvailability
  

};
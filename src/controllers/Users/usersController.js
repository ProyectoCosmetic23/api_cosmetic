const nodemailer = require("nodemailer");
const Users = require("../../models/users.js");
const Employee = require ('../../models/employees');
const jwt = require("jsonwebtoken");

//Función para traer todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const users = await Users.findAll();
    if (users.length === 0) {
      return res.status(404).json({ message: "No hay usuarios registrados" });
    }
    res.json(users);
  } catch (error) {
    console.error("Error al recuperar usuarios:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//Función para traer un usuario por el id
async function getUserById(req, res) {
  const { id } = req.params;
  try {
    const user = await Users.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el usuario." });
  }
}

// Función para verificar si el correo es válido
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

//Buscar empleado por cedula y retornar el correo del empleado 
async function employeeByCard(req, res) {
  const { id_card_employee } = req.params;

  try {
    if (id_card_employee) {
      const employee = await Employee.findOne({ where: { id_card_employee } });

      if (!employee) {
        return res.status(404).json({ message: 'Empleado no encontrado.' });
      }

      // Retorna el correo del empleado si se encuentra
      res.json({ email: employee.email }); 
    } else {
      return res.status(400).json({ message: 'Falta el ID de la cédula en la solicitud.' });
    }
  } catch (error) {
    console.error('Error al buscar el empleado por cédula:', error);
    res.status(500).json({ error: 'Error al buscar el empleado por cédula.' });
  }
}

//Función para crear un usuario nuevo
async function createUser(req, res) {
  const { name_role, id_card_employee, username, email, password, observation_user } =
    req.body;

  // Validar la existencia de los campos requeridos
  if (
    !name_role ||
    !id_card_employee ||
    !username ||
    !email ||
    !password ||
    !observation_user
  ) {
    return res.status(400).json({ error: "Falta campos obligatorios." });
  }

  // Validar la longitud de la contraseña
  if (password.length <= 5) {
    return res
      .status(400)
      .json({ error: "La contraseña debe tener al menos 6 caracteres." });
  }

  // validacion correo valido
  // if (!isValidEmail(email)) {
  //   return res.status(400).json({ error: "El correo no es válido" });
  // }

  try {
    const newUser = await Users.create({
      name_role,
      id_card_employee,
      username,
      email,
      password,
      observation_user
    });

    res.json(newUser);
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    res
      .status(500)
      .json({ error: "Error al crear el usuario. Detalles: " + error.message });
  }
}

// async function checkEmailAvailability(req, res) {
//   const { email } = req.query;
//   try {
//     const existingEmail = await Client.findOne({ where: { email } });
//     res.json(!existingEmail);
//   } catch (error) {
//     console.error("Error al verificar el correo:", error);
//     res.status(500).json({ error: "Error al verificar el correo." });
//   }
// }




//Función para editar el usuario
async function updateUser(req, res) {
  const { id } = req.params;
  const { name_role, id_card_employee, username, email, observation_user } = req.body;

  try {
    const user = await Users.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    // Validar el formato del correo electrónico
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    if (email && !emailRegex.test(email)) {
      return res
        .status(400)
        .json({ error: "El correo electrónico no es válido." });
    }

    // // Validar si el correo ya está en uso por otro usuario 
    // const existingUser = await Users.findOne({ where: { email } });
    // if (existingUser && existingUser.id !== id) {
    //   return res
    //     .status(400)
    //     .json({ error: "El correo ya está en uso por otro usuario." });
    // }

    await user.update({
      name_role,
      id_card_employee,
      username,
      email,
      observation_user,
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el usuario." });
  }
}

//Metodo para loguearse
async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    const user = await Users.findOne({ where: { email: email } });

    if (!user) {
      return res.status(401).json({ error: "Credenciales incorrectas." });
    }

    if (user.state_user === "inactivo") {
      return res.status(400).json({ error: "El usuario está inactivo." });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: "Credenciales incorrectas." });
    }

    res.json({
      message: "Inicio de sesión exitoso.",
      name: user.username,
    });
  } catch (error) {
    console.error("Error al iniciar sesión: ", error);
    res.status(500).json({ error: "Error al iniciar sesión." });
  }
}

//Metodo para actualizar el estado
async function updateUserState (req, res){
  const { id } = req.params;

  let mensaje = "";

  try {
    if (id) {
      // Buscar el usuario por su ID
      const user = await Users.findByPk(id);

      if (user) {
        var state_user_new = "";

        if (user.state_user === "Activo") {
          state_user_new = "Inactivo";
        } else if (user.state_user === "Inactivo") {
          state_user_new = "Activo";
        }

        // Actualizar el estado del usuario
        user.state_user = state_user_new;

        // Guardar los cambios en la base de datos
        await user.save();

        mensaje = "Cambio de estado realizado con éxito.";
      } else {
        mensaje = "El usuario no fue encontrado.";
      }
    } else {
      mensaje = "Falta el ID en la solicitud.";
    }
  } catch (error) {
    console.error("Error al cambiar el estado del usuario:", error);
    mensaje = "Fallo al realizar el cambio de estado: " + error.message;
  }

  res.json({
    msg: mensaje,
  });
};

//Función para generar token
function generateResetToken() {
  const token =
    Math.random().toString(36).substring(2, 12) +
    Math.random().toString(36).substring(2, 12);
  return token;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "julianctsistemas@gmail.com",
    pass: "oiaj aojo whzz vete",
  },
});

// Función para enviar Email
async function sendEmail(email, mailOptions) {
  try {
    // Verifica si el usuario con el correo proporcionado existe
    const user = await Users.findOne({ where: { email: email } });

    if (!user) {
      return { success: false, message: "Usuario no encontrado." };
    }
    const resetToken = generateResetToken();

    await transporter.sendMail(mailOptions);

    return {
      success: true,
      message:
        "Se ha enviado un enlace para restablecer la contraseña por correo electrónico.",
    };
  } catch (error) {
    console.error("Error al recuperar la contraseña:", error);
    return { success: false, message: "Error al recuperar la contraseña." };
  }
}

let resetTokens = {};

//Metodo para recuperacion de contraseña
async function forgotPassword(req, res) {
  const { email } = req.body;

  try {
    // Busca al usuario por el correo proporcionado
    const user = await Users.findOne({ where: { email: email } });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    // Genera un token único para el restablecimiento de contraseña
    const resetToken = generateResetToken();

    // Almacena el token en la variable temporal
    resetTokens[resetToken] = user;

    // Construye el objeto mailOptions con la información necesaria, incluyendo el token en el enlace
    const mailOptions = {
      from: "julianctsistemas@gmail.com",
      to: email,
      subject: "Recuperación de Contraseña",
      text: `Haga clic en el siguiente enlace para restablecer su contraseña: https://localhost:8080/api/change-password?token=${resetToken}`,
    };

    // Enviar correo con el enlace de restablecimiento de contraseña
    await sendEmail(email, mailOptions);

    res.json({
      message:
        "Se ha enviado un enlace para restablecer la contraseña por correo electrónico.",
    });
  } catch (error) {
    console.error("Error al recuperar la contraseña:", error);
    res.status(500).json({ error: "Error al recuperar la contraseña." });
  }
}

// Función para cambiar contraseña
async function changePassword(req, res) {
  const { token, newPassword } = req.body;

  try {
    // Busca al usuario por el token de reseteo
    const user = resetTokens[token];

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    // Actualiza la contraseña
    user.password = newPassword;
    await user.save();

    // Elimina el token de la memoria
    delete resetTokens[token];

    res.json({ message: "Contraseña actualizada exitosamente." });
  } catch (error) {
    console.error("Error al cambiar la contraseña:", error);
    res.status(500).json({ error: "Error al cambiar la contraseña." });
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  loginUser,
  updateUserState,
  forgotPassword,
  changePassword,
  employeeByCard
  

};

const nodemailer = require("nodemailer");
const Users = require("../../models/users.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { generarJWT } = require("../../helpers/generar-jwt.js");
const Employee = require('../../models/employees');

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
      res.json({ email: employee.email, id_employee: employee.id_employee, name_employee: employee.name_employee });
    } else {
      return res.status(400).json({ message: 'Falta el ID de la cédula en la solicitud.' });
    }
  } catch (error) {
    console.error('Error al buscar el empleado por cédula:', error);
    res.status(500).json({ error: 'Error al buscar el empleado por cédula.' });
  }
}

//Función para traer todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const users = await Users.findAll();
    if (users.length === 0) {
      return res.status(404).json({ message: "No hay usuarios registrados" });
    }
    res.json(users);
  } catch (error) {
    console.error("Error fetching usuarios:", error);
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

//Función para crear un usuario nuevo
async function createUser(req, res) {
  const { id_role, id_employee, username, email, password, observation_user } =
    req.body;

  // Validar la existencia de los campos requeridos
  if (!id_role || !id_employee || !username || !email || !password) {
    return res
      .status(400)
      .json({ error: "Todos los campos son obligatorios." });
  }

  // // Validar la longitud de la contraseña
  // if (password.length <= 6) {
  //   return res.status(400).json({ error: "La contraseña debe tener al menos 7 caracteres." });
  // }



  // // Validar que la contraseña contenga al menos una mayúscula, un número y un carácter especial
  // const passwordRegex =/^(?=.[A-Z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%*?&]+$/;
  // if (!passwordRegex.test(password)) {
  //   return res.status(400).json({error:"La contraseña debe contener al menos una mayúscula, un número y un carácter especial.",});
  // }

  // // Validar el formato del correo electrónico
  // const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
  // if (!emailRegex.test(email)) {
  //   return res
  //     .status(400)
  //     .json({ error: "El correo electrónico no es válido." });
  // }

  try {
    // const existingEmail = await Users.findOne({ where: { email } });

    // if (existingEmail) {
    //   return res.status(400).json({ error: "El correo ya está en uso." });
    // }
    

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);

    // Aplica un hash a la contraseña con el salt
    const hash = bcrypt.hashSync(password, salt);

    const user = await Users.create({
      id_role,
      id_employee,
      username,
      email,
      password: hash,
      observation_user,
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    res
      .status(500)
      .json({ error: "Error al crear el usuario. Detalles: " + error.message });
  }
}

async function checkEmailAvailability(req, res) {
  const { email } = req.query;
  try {
    const existingEmail = await Users.findOne({ where: { email:email } });
    res.json(!existingEmail);
  } catch (error) {
    console.error("Error al verificar el correo:", error);
    res.status(500).json({ error: "Error al verificar el correo." });
  }
}
async function checkEmployeeAvailability(req, res) {
  const {id_employee} = req.query;
  try {
    const existingEmployee = await Users.findOne({where: { id_employee: id_employee }});
    res.json(!existingEmployee);
  } catch (error) {
    console.error("Error al verificar la existencia del usuario:", error);
    res.status(500).json({ error: "Error al verificar la existencia del usuario." });
  }
}

//Función para editar el usuario
async function updateUser(req, res) {
  const { id } = req.params;
  const { id_role, id_employee, username, email, observation_user } = req.body;

  try {
    const user = await Users.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    // // Validar el formato del correo electrónico
    // const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    // if (email && !emailRegex.test(email)) {
    //   return res
    //     .status(400)
    //     .json({ error: "El correo electrónico no es válido." });
    // }

    // // Validar si el correo ya está en uso por otro usuario
    // const existingUser = await Users.findOne({ where: { email } });
    // if (existingUser && existingUser.id !== id) {
    //   return res
    //     .status(400)
    //     .json({ error: "El correo ya está en uso por otro usuario." });
    // }

    await user.update({
      id_role,
      id_employee,
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
  console.log(email, password);
  try {
    const user = await Users.findOne({ where: { email: email } });
    console.log("Usuario encontrado:", user);

    if (!user) {
      return res
        .status(401)
        .json({ error: "Correo o Contraseña incorrectas." });
    }

    if (user.state_user !== "Activo") {
      return res
        .status(400)
        .json({ error: "Credenciales incorrectas: El usuario está inactivo." });
    }

    // Obtenemos el rol del usuario
    const userRole = await Roles.findOne({ where: { id_role: user.id_role } });

    // Verificamos el estado del rol
    if (!userRole || userRole.state_role !== "Activo") {
      return res
        .status(403)
        .json({ error: "No tienes permisos para iniciar sesión. Contacta al administrador." });
    }

    // Comparamos la contraseña proporcionada con la contraseña almacenada en la base de datos
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ loginError: "Correo o Contraseña incorrectas." });
    }

    const token = await generarJWT(user.id_user);

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.error("Error al iniciar sesión: ", error);
    res.status(500).json({ error: "Error interno al iniciar sesión.", error });
  }
}




//Metodo para actualizar el estado
async function updateUserState(req, res) {
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
}

//Función para generar token
const crypto = require('crypto');

function generateResetToken() {
  const token = crypto.randomBytes(20).toString('hex');
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

    const resetToken = generateResetToken();
    resetTokens[email] = { token: resetToken };

    // Construye el objeto mailOptions con la información necesaria, incluyendo el token en el enlace
    const mailOptions = {
      from: "julianctsistemas@gmail.com",
      to: email,
      subject: "Recuperación de Contraseña",
      text: `Haga clic en el siguiente enlace para restablecer su contraseña: http://localhost:4200/sessions/signup/${resetToken}`,


      

    };
    console.log("Token generado:", resetToken);


    // Enviar correo con el enlace de restablecimiento de contraseña
    await sendEmail(email, mailOptions);

    res.json({
      message: "Se ha enviado un enlace para restablecer la contraseña por correo electrónico.",
    });
  } catch (error) {
    console.error("Error al recuperar la contraseña:", error);
    res.status(500).json({ error: "Error al recuperar la contraseña." });
  }
}



// Dentro de la función changePassword
async function changePassword(req, res) {
  const { token} = req.params;
  const { newPassword } = req.body;
  // console.log("Token recibido en la solicitud:", token);

  try {
    // Extrae el token sin el prefijo "token="
    const incomingToken = token.replace('token=', '');

    // Utiliza Object.values para obtener un array de tokens y encontrar el correo electrónico correspondiente
    const email = Object.keys(resetTokens).find((key) => {
      const storedTokenBuffer = resetTokens[key] ? Buffer.from(resetTokens[key].token, 'hex') : null;
      const incomingTokenBuffer = incomingToken ? Buffer.from(incomingToken, 'hex') : null;

      if (storedTokenBuffer && incomingTokenBuffer && storedTokenBuffer.length === incomingTokenBuffer.length) {
        const tokensAreEqual = crypto.timingSafeEqual(storedTokenBuffer, incomingTokenBuffer);

        if (tokensAreEqual) {
          return resetTokens[key].token === incomingToken;
        } else {
          // La comparación de tokens falló
          console.error("La comparación de tokens falló.");
          return false;
        }
      } else {
        // Manejar el caso de búferes nulos o de longitudes diferentes
        console.error("Búferes nulos o de longitudes diferentes.");
        return false;
      }
    });

    if (!email) {
      console.error("Correo electrónico no encontrado para el token:", token);
      return res.status(404).json({ error: "Correo electrónico no encontrado para el token." });
    }

    const user = await Users.findOne({ where: { email: email } });

    if (!user) {
      console.error("Usuario no encontrado. Correo electrónico:", email);
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    // Actualiza la contraseña
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);
    user.password = hashedPassword;

    // Guarda los cambios en la base de datos
    await user.save();

    // Elimina el token de la memoria
    delete resetTokens[email];

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
  checkEmailAvailability,
  employeeByCard
};

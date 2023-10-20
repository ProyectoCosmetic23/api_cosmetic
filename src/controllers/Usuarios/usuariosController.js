const nodemailer = require ('nodemailer');
const Usuarios = require ('../../models/usuarios.js');
const jwt = require('jsonwebtoken');


//Función para traer todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const usuarios = await Usuarios.findAll();
    if (usuarios.length === 0) {
      return res.status(404).json({ message: "No hay usuarios registrados" });
    }
    res.json(usuarios);
  } catch (error) {
    console.error('Error fetching usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


//Función para traer un usuario por el id
async function getUserById(req, res) {
  const { id } = req.params;
  try {
    const usuario = await Usuarios.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el usuario.' });
  }
}

//Función para crear un usuario nuevo
async function createUser(req, res) {
  const { id_rol, id_empleado, nombre_usuario, correo_usuario, contrasena_usuario, observacion_usuario } = req.body;

  // Validar la existencia de los campos requeridos
  if (!id_rol || !id_empleado || !nombre_usuario || !correo_usuario || !contrasena_usuario) {
    return res.status(400).json({ error: "Todos los campos son obligatorios." });
  }

  // Validar la longitud de la contraseña
  if (contrasena_usuario.length <= 6) {
    return res.status(400).json({ error: "La contraseña debe tener al menos 7 caracteres." });
  }

  // Validar que la contraseña contenga al menos una mayúscula, un número y un carácter especial
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
  if (!passwordRegex.test(contrasena_usuario)) {
    return res.status(400).json({ error: "La contraseña debe contener al menos una mayúscula, un número y un carácter especial." });
  }

  // Validar el formato del correo electrónico
  const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
  if (!emailRegex.test(correo_usuario)) {
    return res.status(400).json({ error: "El correo electrónico no es válido." });
  }


  try {
    const correoExistente = await Usuarios.findOne({ where: { correo_usuario } });

    if (correoExistente) {
      return res.status(400).json({ error: "El correo ya está en uso." });
    }

    const usuario = await Usuarios.create({
      id_rol,
      id_empleado,
      nombre_usuario,
      correo_usuario,
      contrasena_usuario,
      observacion_usuario
    });
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el usuario.' });
  }
}


//Función para editar el usuario
async function updateUser(req, res) {
  const { id } = req.params;
  const { id_rol, id_empleado, nombre_usuario, correo_usuario, observacion_usuario } = req.body;

  try {
    const usuario = await Usuarios.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    // Validar el formato del correo electrónico
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    if (correo_usuario && !emailRegex.test(correo_usuario)) {
      return res.status(400).json({ error: "El correo electrónico no es válido." });
    }

    // Validar si el correo ya está en uso por otro usuario
    const existingUser = await Usuarios.findOne({ where: { correo_usuario } });
    if (existingUser && existingUser.id !== id) {
      return res.status(400).json({ error: "El correo ya está en uso por otro usuario." });
    }

    await usuario.update({
      id_rol,
      id_empleado,
      nombre_usuario,
      correo_usuario,
      observacion_usuario
    });

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el usuario.' });
  }
}


//Metodo para loguearse
async function loginUser(req, res) {
  const { correo_usuario, contrasena_usuario } = req.body;

  try {
    const usuario = await Usuarios.findOne({ where: { correo_usuario: correo_usuario } });

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }

    if (usuario.estado_usuario === 'inactivo') {
      return res.status(400).json({ error: 'El usuario está inactivo.' });
    }

    if (usuario.contrasena_usuario !== contrasena_usuario) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }

    res.json({
      message: "Inicio de sesión exitoso.",
      name: usuario.nombre_usuario
    });

  } catch (error) {
    console.error("Error al iniciar sesión: ", error);
    res.status(500).json({ error: "Error al iniciar sesión." });
  }
}

//Metodo para actualizar el estado
const updateUserState = async (req, res) => {
  const { id } = req.params; // El ID del usuario
  const { estado_usuario} = req.body;
  let mensaje = '';

  try {
      if (id) {
          // Buscar el usuario por su ID
          const usuario = await Usuarios.findByPk(id);

          if (usuario) {
              // Actualizar los campos del usuario
              usuario.estado_usuario = estado_usuario;
              

              // Guardar los cambios en la base de datos
              await usuario.save();

              mensaje = "Se cambio el estado correctamente";
          } else {
              mensaje = "El usuario no fue encontrado";
          }
      } else {
          mensaje = "Falta el ID en la solicitud";
      }
  } catch (error) {
    console.error("Error al guardar el usuario:", error);
    mensaje = "Ocurrió un error al actualizar el usuario: " + error.message;
}

  res.json({
      msg: mensaje
  });
};



//Función para generar token
function generateResetToken() {

  const token = Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12);
  return token;
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'julianctsistemas@gmail.com',
    pass: 'oiaj aojo whzz vete'
  }
});


// Función para enviar Email
async function sendEmail(correo_usuario, mailOptions) {
  try {
    // Verifica si el usuario con el correo proporcionado existe
    const usuario = await Usuarios.findOne({ where: { correo_usuario: correo_usuario } });

    if (!usuario) {
      return { success: false, message: 'Usuario no encontrado.' };
    }
    const resetToken = generateResetToken();

    await transporter.sendMail(mailOptions);

    return { success: true, message: 'Se ha enviado un enlace para restablecer la contraseña por correo electrónico.' };
  } catch (error) {
    console.error('Error al recuperar la contraseña:', error);
    return { success: false, message: 'Error al recuperar la contraseña.' };
  }
}

let resetTokens = {};



//Metodo para recuperacion de contraseña
async function forgotPassword(req, res) {
  const { correo_usuario } = req.body;

  try {
    // Busca al usuario por el correo proporcionado
    const usuario = await Usuarios.findOne({ where: { correo_usuario: correo_usuario } });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    // Genera un token único para el restablecimiento de contraseña
    const resetToken = generateResetToken();

    // Almacena el token en la variable temporal
    resetTokens[resetToken] = usuario;

    // Construye el objeto mailOptions con la información necesaria, incluyendo el token en el enlace
    const mailOptions = {
      from: 'julianctsistemas@gmail.com',
      to: correo_usuario,
      subject: 'Recuperación de Contraseña',
      text: `Haga clic en el siguiente enlace para restablecer su contraseña: https://localhost:8080/api/change-password?token=${resetToken}`,
    };

    // Enviar correo con el enlace de restablecimiento de contraseña
    await sendEmail(correo_usuario, mailOptions);

    res.json({ message: 'Se ha enviado un enlace para restablecer la contraseña por correo electrónico.' });
  } catch (error) {
    console.error('Error al recuperar la contraseña:', error);
    res.status(500).json({ error: 'Error al recuperar la contraseña.' });
  }
}


// Función para cambiar contraseña
async function changePassword(req, res) {
  const { token, newPassword } = req.body;

  try {
    // Busca al usuario por el token de reseteo
    const usuario = resetTokens[token];

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    // Actualiza la contraseña
    usuario.contrasena_usuario = newPassword;
    await usuario.save();

    // Elimina el token de la memoria
    delete resetTokens[token];

    res.json({ message: 'Contraseña actualizada exitosamente.' });
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    res.status(500).json({ error: 'Error al cambiar la contraseña.' });
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
  changePassword
};

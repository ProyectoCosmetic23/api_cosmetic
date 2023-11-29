const { response, request } = require('express');
const jwt = require('jsonwebtoken');



const validarJWT = (req = request, res = response, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        
        console.log('Token recibido:', token);
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        console.log('Token válido para el usuario con ID:', uid);
        req.uid = uid;
        next();
    } catch (error) {
        console.error('Error al verificar el token:', error.message);
        res.status(401).json({
            msg: 'Token no válido o expirado'
        });
    }
};

module.exports = {
    validarJWT
}

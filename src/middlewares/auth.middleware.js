import jwt from 'jsonwebtoken';
import ENVIROMENT from '../config/enviroment.js';

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extraer el token del encabezado
  console.log("Token recibido:", token); // Log para verificar que el token se pasa correctamente

  if (!token) {
    return res.status(401).json({
      ok: false,
      message: 'Token no proporcionado'
    });
  }

  jwt.verify(token, ENVIROMENT.SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error("Error al verificar el token:", err.message); // Log detallado
      return res.status(401).json({
        ok: false,
        message: 'Token inválido'
      });
    }

    console.log("Token decodificado:", decoded); // Verifica los datos decodificados del token
    req.user = decoded;
    next();
  });
};

export default authMiddleware;


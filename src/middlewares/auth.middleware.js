import jwt from 'jsonwebtoken';
import ENVIROMENT from '../config/enviroment.js';

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extraer el token del encabezado

  if (!token) {
    return res.status(401).json({
      ok: false,
      message: 'Token no proporcionado'
    });
  }

  jwt.verify(token, ENVIROMENT.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        message: 'Token inválido'
      });
    }

    console.log("Token decodificado:", decoded);
    req.user = { id: decoded.user_id };  // Asegúrate de extraer el `user_id` correctamente

    next();
  });
};

export default authMiddleware;

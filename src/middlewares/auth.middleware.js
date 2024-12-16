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
    req.user = { id: decoded.user_id };

    next();
  });
};




export const authenticateUser = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];  // El token debe enviarse en el header "Authorization"

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // El secreto usado para firmar el JWT
    req.user = decoded;  // Adjunta el user a la solicitud
    next();  // Continua al siguiente middleware o controlador
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default authMiddleware;

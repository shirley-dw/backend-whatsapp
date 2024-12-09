import jwt from "jsonwebtoken";
import ENVIROMENT from "../config/enviroment.js";
import User from "../models/user.model.js";

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token no encontrado" });
  }

  try {
    const decoded = jwt.verify(token, ENVIROMENT.SECRET_KEY);
    const user = await User.findById(decoded.user_id);

    if (!user) {
      return res.status(403).json({ message: "Usuario no encontrado" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error al verificar el token:", error);
    return res.status(403).json({ message: "Token no válido" });
  }
};

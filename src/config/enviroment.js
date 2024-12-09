// Módulo con la lógica de las variables de entorno de mi aplicación

import dotenv from "dotenv";

// process es una variable global que guarda datos del proceso de ejecución de Node.js
// Configuramos en process.env las variables de entorno del archivo .env
dotenv.config();

const ENVIROMENT = {
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || "",
  EMAIL_USER: process.env.EMAIL_USER || "",
  SECRET_KEY: process.env.SECRET_KEY || "",
  FRONTEND_URL: process.env.FRONTEND_URL || "",
  MONGO_URL: process.env.MONGO_URL || "",
};

export default ENVIROMENT;

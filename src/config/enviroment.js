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
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  BACKEND_URL: process.env.BACKEND_URL || "",
  MONGO_DB_CONNECTION_STR: process.env.MONGO_DB_CONNECTION_STR || "",
  MONGO_DB_DATABASE: process.env.MONGO_DB_DATABASE || "",
};

export default ENVIROMENT;

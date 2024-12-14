import express from "express";

import {
  forgotPasswordController,
  loginController,
  logoutController,
  recoveryPasswordController,
  registerController,
  verifyEmailController,
  userInformationIdController,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

// Rutas de autenticación
authRouter.put("/reset-password", recoveryPasswordController); // Restablecer contraseña
authRouter.post("/register", registerController); // Registro
authRouter.post("/login", loginController); // Iniciar sesión
authRouter.get("/verify-email/:validation_token", verifyEmailController); // Verificar correo
authRouter.post("/forgot-password", forgotPasswordController); // Restablecer contraseña
authRouter.get("/user/:user_id", userInformationIdController); // Información de usuario
authRouter.post("/logout", logoutController); // Cerrar sesión

export default authRouter;
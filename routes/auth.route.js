import express from "express";
// Controller de registro
import {
  forgotPasswordController,
  loginController,
  logoutController,
  recoveryPasswordController,
  registerController,
  verifyEmailController,
} from "../controllers/auth.controller.js";
// Controller de contactos
import {
  createContactController,
  deleteContactController,
  getAllContactsController,
  getContactByIdController,
  updateContactController,
  getContactsByUserIdController,
  createOrAssociateContactController
} from "../controllers/contact.controller.js";
// Middleware de controller de autenticación
/* import { authenticateToken } from '../src/middlewares/auth.middleware.js'; */
// Controller de mensajes
import {
  createMessageController,
  deleteMessageController,
  getAllMessagesController,
  getMessageByIdController,
  getMessagesByUserOrContact,
  updateMessageController,
} from "../controllers/message.controller.js";
import { getUserById } from "../controllers/user.controller.js";

const router = express.Router();

// Rutas de autenticación
router.put("/reset-password", recoveryPasswordController);
router.post("/register", registerController);
router.post("/login", loginController);
router.get("/verify-email/:validation_token", verifyEmailController);
router.post("/forgot-password", forgotPasswordController);


// Rutas de contactos
router.post("/contacts", createContactController);
router.get("/contacts", getAllContactsController);
router.get("/contacts/:id", getContactByIdController);
router.put("/contacts/:id", updateContactController);
router.get("/contacts/user/:id", getContactsByUserIdController);
router.delete("/contacts/:id", deleteContactController);
router.post('/contacts/user/:userId', createOrAssociateContactController);


// Rutas de mensajes
router.post("/messages", createMessageController);
router.get("/messages", getAllMessagesController);
// router.get("/messages/:id", [validJwt], getMessageByIdController);
router.get("/messages/:id", getMessageByIdController);
router.put("/messages/:id", updateMessageController);
router.delete("/messages/:id", deleteMessageController);

//Ruta de usuario
router.get("/user/:id", getUserById);

//Ruta de cerrar sesion
router.post("/logout", logoutController);

// Ruta para obtener mensajes según el usuario y el tipo (author o destinatario)
router.get("/:id/:type", getMessagesByUserOrContact);

export default router;

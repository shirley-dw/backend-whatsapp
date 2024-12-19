import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
    createContactForUser,
    deleteContactController,
    getAllContactsController,
    getContactByIdController,
    getUserContacts

} from "../controllers/contact.controller.js";


const contactRouter = express.Router();

// Rutas de contactos

contactRouter.post("/add/:id", authMiddleware, createContactForUser);                  // Crear contacto para un usuario
contactRouter.get("/contacts", authMiddleware, getAllContactsController);              // Obtener todos los contactos
contactRouter.get("/contacts/:contact_id", authMiddleware, getContactByIdController);  // Obtener contacto por ID
contactRouter.delete("/delete/:contact_id", authMiddleware, deleteContactController);  // Eliminar contacto
contactRouter.get("/userContacts", authMiddleware, getUserContacts);                   // Obtener contactos de un usuario
export default contactRouter;




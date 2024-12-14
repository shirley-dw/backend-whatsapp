import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
    addContact,
    deleteContactController,
    getAllContactsController,
    getContactByIdController,
    updateContactController,

} from "../controllers/contact.controller.js";


const contactRouter = express.Router();

// Rutas de contactos

contactRouter.post("/add", authMiddleware, addContact);                     // Crear contacto
contactRouter.get("/contacts", authMiddleware, getAllContactsController);            // Obtener todos los contactos
contactRouter.get("/contacts/:id", authMiddleware, getContactByIdController);        // Obtener contacto por ID
contactRouter.put("/contacts/:contact_id", authMiddleware, updateContactController);         // Actualizar contacto
contactRouter.delete("/contacts/:id", authMiddleware, deleteContactController);      // Eliminar contacto

export default contactRouter;




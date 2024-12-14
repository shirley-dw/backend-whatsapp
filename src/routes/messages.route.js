import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";

import {
    createMessage,
    deleteMessageController,
    getAllMessagesController,
    getMessageByIdController,
    updateMessageController,
    getConversation
} from "../controllers/message.controller.js";

const messageRouter = express.Router();


// Rutas de mensajes

messageRouter.post("/messages", authMiddleware, createMessage); // Crear mensaje
messageRouter.get("/messages", authMiddleware, getAllMessagesController); // Obtener todos los mensajes
messageRouter.get("/messages/:id", authMiddleware, getMessageByIdController); // Obtener mensaje por ID
messageRouter.put("/messages/:id", authMiddleware, updateMessageController); // Actualizar mensaje
messageRouter.delete("/messages/:id", authMiddleware, deleteMessageController); // Eliminar mensaje
messageRouter.get("/conversation/:receiver_id", authMiddleware, getConversation);  // Ruta correcta

export default messageRouter;
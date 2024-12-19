import express from "express";

import {
    createMessage,
    deleteMessageController,
    updateMessageController,
    getConversation,
    getLastMessageController
} from "../controllers/message.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

const messageRouter = express.Router();


messageRouter.post("/messages", authMiddleware, createMessage); // Crear mensaje
messageRouter.put("/messages/:id", authMiddleware, updateMessageController); // Actualizar mensaje
messageRouter.delete("/messages/:id", authMiddleware, deleteMessageController); // Eliminar mensaje
messageRouter.get("/conversation/:user_id/:receiver_id", authMiddleware, getConversation);  // Obtener conversación entre dos usuarios
messageRouter.get("/lastMessage/:user_id/:receiver_id", authMiddleware, getLastMessageController);  // Obtener el ultimo mensaje entre dos usuarios

export default messageRouter;
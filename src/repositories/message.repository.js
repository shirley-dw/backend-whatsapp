
import mongoose from "mongoose";
import Message from "../models/message.model.js";

class MessageRepository {
    // Crear un nuevo mensaje
    static async createMessage(message_data) {
        try {
            return await Message.create(message_data);
        } catch (error) {
            console.error("Error al crear el mensaje:", error);
            throw new Error("Error al crear el mensaje");
        }
    }

    // Encontrar mensajes entre dos usuarios con soporte para paginación y ordenación
    static async findMessagesBetweenUsers(user_id_1, user_id_2, page = 1, limit = 10, sort = -1) {
        try {
            const messages = await Message.find({
                $or: [
                    { author: user_id_1, receiver: user_id_2 },
                    { author: user_id_2, receiver: user_id_1 }
                ]
            })
                .sort({ createdAt: sort })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean();

            return messages;
        } catch (error) {
            console.error("Error al obtener los mensajes:", error);
            throw new Error("Error al obtener los mensajes");
        }
    }

    // Obtener el total de mensajes entre dos usuarios
    static async countMessagesBetweenUsers(user_id_1, user_id_2) {
        try {
            return await Message.countDocuments({
                $or: [
                    { author: user_id_1, receiver: user_id_2 },
                    { author: user_id_2, receiver: user_id_1 }
                ]
            });
        } catch (error) {
            console.error("Error al contar los mensajes:", error);
            throw new Error("Error al contar los mensajes");
        }
    }

    // Obtener todos los mensajes
    static async findAllMessages() {
        try {
            return await Message.find().lean();  // Obtiene todos los mensajes
        } catch (error) {
            console.error("Error al obtener todos los mensajes:", error);
            throw new Error("Error al obtener todos los mensajes");
        }
    }

    // Encontrar un mensaje por IDimport Message from "../models/message.model.js";

    static async findMessageById(id) {
        try {
            return await Message.findById(id).lean();  // Obtiene un mensaje específico
        } catch (error) {
            console.error("Error al obtener el mensaje:", error);
            throw new Error("Error al obtener el mensaje");
        }
    }


    // Actualizar un mensaje por ID
    static async updateMessageById(id, updateData) {
        try {
            return await Message.findByIdAndUpdate(id, updateData, { new: true }).lean();
        } catch (error) {
            console.error("Error al actualizar el mensaje:", error);
            throw new Error("Error al actualizar el mensaje");
        }
    }

    // Eliminar un mensaje por ID
    static async deleteMessageById(id) {
        try {
            return await Message.findByIdAndDelete(id).lean();
        } catch (error) {
            console.error("Error al eliminar el mensaje:", error);
            throw new Error("Error al eliminar el mensaje");
        }
    }
}

export default MessageRepository;


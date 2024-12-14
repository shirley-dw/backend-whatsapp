
import MessageRepository from "../repositories/message.repository.js";
import mongoose from "mongoose";

// Crear un nuevo mensaje
export const createMessage = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { receiver_id, content, hour, day } = req.body;

    if (!hour || !day) {
      return res.status(400).json({
        ok: false,
        status: 400,
        message: "Hour and day are required"
      });
    }


    const new_message = await MessageRepository.createMessage({
      author: user_id,
      receiver: receiver_id,
      content: content,
      hour: hour,
      day: day
    });

    return res.status(201).json({
      ok: true,
      status: 201,
      message: 'Message created successfully',
      data: {
        message: new_message
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      status: 500,
      message: 'Internal server error'
    });
  }
};


export const getConversation = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { receiver_id } = req.params;

    const conversation = await MessageRepository.findMessagesBetweenUsers(user_id, receiver_id);

    return res.status(200).json({
      ok: true,
      status: 200,
      message: 'Conversation found',
      data: {
        conversation,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      status: 500,
      message: 'Internal server error',
    });
  }
};

// Obtener todos los mensajes

export const getAllMessagesController = async (req, res) => {
  try {
    const messages = await MessageRepository.findAllMessages();
    if (!messages || messages.length === 0) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: "No messages found"
      });
    }

    return res.status(200).json({
      ok: true,
      status: 200,
      data: messages
    });
  } catch (error) {
    console.error("Error al obtener los mensajes:", error);
    return res.status(500).json({
      ok: false,
      status: 500,
      message: "Error interno del servidor"
    });
  }
};


// Obtener un mensaje por ID
export const getMessageByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el id es válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        ok: false,
        status: 400,
        message: "Invalid message ID"
      });
    }

    const message = await MessageRepository.findMessageById(id);
    if (!message) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: "Message not found"
      });
    }

    return res.status(200).json({
      ok: true,
      status: 200,
      message: "Message found",
      data: message
    });
  } catch (error) {
    console.error("Error al obtener el mensaje:", error);
    return res.status(500).json({
      ok: false,
      status: 500,
      message: "Error interno del servidor"
    });
  }
};


// Actualizar un mensaje por ID
export const updateMessageController = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, status, day, hour } = req.body;

    const updatedMessage = await MessageRepository.updateMessageById(id, {
      text,
      status,
      day,
      hour,
    });

    if (!updatedMessage) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: "Message not found",
      });
    }

    return res.status(200).json({
      ok: true,
      status: 200,
      message: "Message updated successfully",
      data: updatedMessage,
    });
  } catch (error) {
    console.error("Error al actualizar el mensaje:", error);
    return res.status(500).json({
      ok: false,
      status: 500,
      message: "Error al actualizar el mensaje",
    });
  }
};

// Eliminar un mensaje por ID
export const deleteMessageController = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMessage = await MessageRepository.deleteMessageById(id);

    if (!deletedMessage) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: "Message not found",
      });
    }

    return res.status(200).json({
      ok: true,
      status: 200,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Error al eliminar el mensaje:", error);
    return res.status(500).json({
      ok: false,
      status: 500,
      message: "Error al eliminar el mensaje",
    });
  }
};

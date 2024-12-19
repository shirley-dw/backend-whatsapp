import MessageRepository from "../repositories/message.repository.js";

// Crear un nuevo mensaje
export const createMessage = async (req, res) => {
  try {
    const user_id = req.user.id;  // Obtener el user_id desde el JWT decodificado
    const { receiver_id, content } = req.body;

    if (!user_id || !receiver_id || !content) {
      return res.status(400).json({ ok: false, message: 'Missing required fields' });
    }

    const new_message = await MessageRepository.createMessage({
      author: user_id,  // Asegúrate de que user_id esté correctamente asignado aquí
      receiver: receiver_id,
      content: content
    });

    return res.status(201).json({
      ok: true,
      status: 201,
      message: 'Message created',
      data: { message: new_message }
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

// Obtener la conversación entre dos usuarios
export const getConversation = async (req, res) => {
  try {
    const { user_id, receiver_id } = req.params;

    // Realizar la consulta a la base de datos
    const conversation = await MessageRepository.findMessagesBetweenUsers(user_id, receiver_id);
    console.log('Conversation:', conversation);

    // Si la conversación está vacía
    if (conversation.length === 0) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: 'No messages found between the users.'
      });
    }

    return res.status(200).json({
      ok: true,
      status: 200,
      message: 'Conversation found',
      data: {
        conversation
      }
    });
  } catch (error) {
    console.error('Error occurred:', error);
    return res.status(500).json({
      ok: false,
      status: 500,
      message: 'Internal server error'
    });
  }
};


// Obtener el último mensaje entre dos usuarios
export const getLastMessageController = async (req, res) => {
  try {
    const { user_id, receiver_id } = req.params;  // Obtener user_id y receiver_id desde los parámetros de la URL

    const lastMessage = await MessageRepository.findLastMessageBetweenUsers(user_id, receiver_id);

    if (!lastMessage) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: "No se encontró el último mensaje en esta conversación",
      });
    }

    return res.status(200).json({
      ok: true,
      status: 200,
      message: "Último mensaje obtenido exitosamente",
      data: lastMessage,
    });

  } catch (error) {
    console.error("Error al obtener el último mensaje:", error);
    return res.status(500).json({
      ok: false,
      status: 500,
      message: "Error al obtener el último mensaje",
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


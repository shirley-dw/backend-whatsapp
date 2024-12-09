import mongoose from "mongoose";
import ResponseBuilder from "../src/helpers/builders/responseBuilder.js";
import Contacto from "../src/models/contact.model.js";
import Message from "../src/models/message.model.js";
import User from "../src/models/user.model.js";

// Crear un nuevo mensaje

export const createMessageController = async (req, res) => {
  try {
    // Extraer datos del cuerpo de la solicitud
    const { author, text, status, day, hour, destinatario } = req.body;

    // Validar que los campos necesarios están presentes y son válidos
    if (!author || !mongoose.Types.ObjectId.isValid(author)) {
      return res
        .status(400)
        .json({ message: "Author debe ser un ObjectId válido" });
    }

    if (!destinatario || !mongoose.Types.ObjectId.isValid(destinatario)) {
      return res
        .status(400)
        .json({ message: "Destinatario debe ser un ObjectId válido" });
    }

    const [user, dest] = await Promise.all([
      User.findById(author),
      User.findById(destinatario),
    ]);

    // Verificar que el autor (user) existe
    if (!user) {
      return res.status(400).json({ message: "El autor no existe" });
    }

    // Verificar que el destinatario (contacto) existe como usario y busco el contacto según el id del usuario
    if (!dest) {
      return res.status(400).json({ message: "El destinatario no existe" });
    }

    // Crear el mensaje
    const newMessage = new Message({
      author,
      text,
      status,
      day,
      hour,
      destinatario: dest,
    });

    const savedMessage = await newMessage.save();

    // Popular los datos del autor y destinatario
    const populatedMessage = await Message.findById(savedMessage._id)
      .populate("author", "name")
      .populate("destinatario", "_id");

    // Respuesta exitosa
    return res.status(200).json(populatedMessage);
  } catch (error) {
    console.error("Error al crear el mensaje:", error);
    return res.status(500).json({ message: "Error al crear el mensaje" });
  }
};

// Obtener todos los mensajes
export const getAllMessagesController = async (req, res) => {
  try {
    const messages = await Message.find().populate("author", "name");
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los mensajes" });
  }
};

export const getMessageByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar información del contacto
    const contacto = await Contacto.findById(id);
    const usuario = await User.findOne({ email: contacto.email });

    if (!contacto) {
      return res.status(404).json({ message: "Contacto no encontrado" });
    }

    // Mensajes enviados por el contacto
    const mensajesEnviados = await Message.find({ author: usuario._id })
      .populate("author", "name")
      .populate("destinatario", "name");

    // Mensajes recibidos por el contacto
    const mensajesRecibidos = await Message.find({ destinatario: usuario._id })
      .populate("author", "name")
      .populate("destinatario", "name");

    // Combinar los mensajes enviados y recibidos
    const messages = [...mensajesEnviados, ...mensajesRecibidos];

    // SE ORDENAN LOS MENSAJES SEGÚN LA ANTIGUEDAD DEL MENSAJE. EL MAS VIEJO PRIMERO. MODELO "FIFO"
    const mensajesOrdenadosAsc = messages.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    res.status(200).json({
      contacto: contacto,
      mensajesOrdenadosAsc,
    });
  } catch (error) {
    console.error("Error al obtener los mensajes:", error);
    res.status(500).json({ message: "Error al obtener los mensajes" });
  }
};


// Actualizar un mensaje por ID
export const updateMessageController = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, status, day, hour } = req.body;

    const message = await Message.findById(id);
    // Verificar si el mensaje existe
    if (!message) {
      const response = new ResponseBuilder()
        .setOk(false)
        .setCode(404)
        .setMessage("Mensaje no encontrado")
        .build();
      return res.status(404).json(response);
    }
    // Actualizar los campos del mensaje
    message.text = text || message.text;
    message.status = status || message.status;
    message.day = day || message.day;
    message.hour = hour || message.hour;

    await message.save();
    // Respuesta exitosa
    const response = new ResponseBuilder()
      .setCode("SUCCESS")
      .setOk(true)
      .setStatus(200)
      .setData({ message })
      .build();
    return res.status(200).json(response);
  }
  // Manejar errores
  catch (error) {
    console.error("Error al actualizar el mensaje:", error);
    const response = new ResponseBuilder()
      .setOk(false)
      .setCode(500)
      .setMessage("Error al actualizar el mensaje")
      .build();
    return res.status(500).json(response);
  }
};

// Eliminar un mensaje por ID
export const deleteMessageController = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findById(id);
    // Verificar si el mensaje existe
    if (!message) {
      const response = new ResponseBuilder()
        .setOk(false)
        .setCode(404)
        .setMessage("Mensaje no encontrado")
        .build();
      return res.json(response);
    }

    await Message.findByIdAndDelete(id);
    // Respuesta exitosa
    const response = new ResponseBuilder()
      .setCode("SUCCESS")
      .setOk(true)
      .setStatus(200)
      .setMessage("Mensaje eliminado correctamente")
      .build();
    return res.json(response);
  }
  // Manejar errores
  catch (error) {
    console.error(error);
    const response = new ResponseBuilder()
      .setOk(false)
      .setCode(500)
      .setMessage("Error al eliminar el mensaje")
      .build();
    return res.json(response);
  }
};

// Obtener mensajes por author o destinatario
export const getMessagesByUserOrContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.params;
    const messages = await Message.find({ [type]: id }).populate(
      "author",
      "name"
    );
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los mensajes" });
  }
};

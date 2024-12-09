import mongoose from "mongoose";
import ResponseBuilder from "../src/helpers/builders/responseBuilder.js";
import {
  verifyEmail,
  verifyMinLength,
  verifyPhone,
  verifyString,
} from "../src/helpers/validations.helpers.js";
import Contacto from "../src/models/contact.model.js";
import User from "../src/models/user.model.js";

export const createContactController = async (req, res) => {
  try {
    const { name, email, phone, text } = req.body;

    const errors = {};

    const validateField = (field, value, validators) => {
      const fieldErrors = validators
        .map((validate) => validate(field, value))
        .filter(Boolean);
      if (fieldErrors.length) errors[field] = fieldErrors;
    };

    validateField("name", name, [
      verifyString,
      (field) => verifyMinLength(field, name, 5),
    ]);
    validateField("email", email, [verifyEmail]);
    validateField("phone", phone, [verifyPhone]);

    if (Object.keys(errors).length) {
      const response = new ResponseBuilder()
        .setOk(false)
        .setStatus(400)
        .setCode("VALIDATION_ERROR")
        .setMessage("Validaciones fallidas")
        .setData({ errors })
        .build();
      return res.status(400).json(response);
    }

    // VERIFICO QUE EL USUARIO CONTACTO EXISTA
    let usuario = await User.findOne({ email });

    // EN EL BODY RECIBO EL MAIL DEL USUARIO QUE QUIERO CREAR, VERIFICO QUE EXISTA UN USUARIO CON ESE MAIL Y EN CASO QUE EXISTA, LO AGENDA COMO CONTACTO

    if (!usuario) {
      return res
        .status(400)
        .json("EL CONTACTO CON EL MAIL " + email + " NO EXISTE");
    }

    const contactCreated = new Contacto({ name, email, phone, text, usuario });
    await contactCreated.save();

    const response = new ResponseBuilder()
      .setCode("SUCCESS")
      .setOk(true)
      .setStatus(200)
      .setData({ contactResult: contactCreated })
      .build();
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error al crear el contacto:", error);

    if (error.code === 11000) {
      // Error de duplicado en MongoDB
      const response = new ResponseBuilder()
        .setOk(false)
        .setCode(400)
        .setMessage("Email ya está registrado")
        .setData({ detail: "El email ya está registrado" })
        .build();
      return res.status(400).json(response);
    } else {
      const response = new ResponseBuilder()
        .setOk(false)
        .setCode(500)
        .setMessage("Error interno del servidor")
        .build();
      return res.status(500).json(response);
    }
  }
};


// Obtener todos los contactos

export const getAllContactsController = async (req, res) => {
  try {
    // Obtengo todos los contactos
    const contactos = await Contacto.find();
    // Construyo la respuesta con los contactos obtenidos
    const response = new ResponseBuilder()
      .setCode("SUCCESS")
      .setOk(true)
      .setStatus(200)
      .setData(contactos)
      .build();
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error al obtener los contactos:", error);
    const response = new ResponseBuilder()
      .setOk(false)
      .setCode(500)
      .setMessage("Error al obtener los contactos")
      .build();
    return res.status(500).json(response);
  }
};

// Obtener un contacto por ID

export const getContactByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }
    // Ignoro la lista de contactos que tiene este contacto
    const contacto = await Contacto.findById(id);

    if (!contacto) {
      return res.status(404).json({ message: "Contacto no encontrado" });
    }

    res.status(200).json(contacto);
  } catch (error) {
    console.error("Error al obtener el contacto:", error);
    res.status(500).json({ message: "Error al obtener el contacto" });
  }
};


// Obtener contactos por el id del usuario

export const getContactsByUserIdController = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    // Busco usuario por su ID y populo sus contactos
    const usuario = await User.findById(id).populate('contactos');

    if (!usuario) {
      return res.status(404).json({ message: "Contactos del usuario no encontrados" });
    }

    res.status(200).json(usuario.contactos);
  } catch (error) {
    console.error("Error al obtener los contactos del usuario:", error);
    res.status(500).json({ message: "Error al obtener los contactos del usuario" });
  }
};


// Crear o asociar un contacto al usuario
export const createOrAssociateContactController = async (req, res) => {
  try {
    const { name, email, phone, text } = req.body;
    const { userId } = req.params;

    // Verifico que es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "ID de usuario inválido" });
    }
    // Busco el contacto en la base de datos por su email
    let contacto = await Contacto.findOne({ email });

    if (contacto) {
      // Si el contacto existe, agregarlo a la lista de contactos del usuario
      const usuario = await User.findById(userId);
      if (!usuario.contactos.includes(contacto._id)) {
        usuario.contactos.push(contacto._id);
        await usuario.save();
      }
    } else {
      // Crear un nuevo contacto
      contacto = new Contacto({
        name,
        email,
        phone,
        text,
        usuario: [userId],
      });

      await contacto.save();

      // Agrego el contacto al usuario
      const usuario = await User.findById(userId);
      usuario.contactos.push(contacto._id);
      await usuario.save();
    }

    res.status(200).json({ message: "Contacto creado o asociado con éxito", contacto });
  } catch (error) {
    console.error("Error al crear o asociar el contacto:", error);
    res.status(500).json({ message: "Error al crear o asociar el contacto" });
  }
};

// Actualizar un contacto por ID
export const updateContactController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, text } = req.body;

    const contacto = await Contacto.findById(id);
    const usuario = await User.findOne({ email: contacto.email });

    if (!contacto) {
      const response = new ResponseBuilder()
        .setOk(false)
        .setCode(404)
        .setMessage("Contacto no encontrado")
        .build();
      return res.json(response);
    }

    contacto.name = name || contacto.name;
    contacto.email = email || contacto.email;
    contacto.phone = phone || contacto.phone;
    contacto.text = text || contacto.text;
    contacto.usuario = usuario || contacto.usuario;

    await contacto.save();

    const response = new ResponseBuilder()
      .setCode("SUCCESS")
      .setOk(true)
      .setStatus(200)
      .setData({ contacto })
      .build();
    return res.json(response);
  } catch (error) {
    console.error(error);
    const response = new ResponseBuilder()
      .setOk(false)
      .setCode(500)
      .setMessage("Error al actualizar el contacto")
      .build();
    return res.json(response);
  }
};

// Eliminar un contacto por ID
export const deleteContactController = async (req, res) => {
  try {
    const { id } = req.params;

    const contacto = await Contacto.findById(id);

    if (!contacto) {
      const response = new ResponseBuilder()
        .setOk(false)
        .setCode(404)
        .setMessage("Contacto no encontrado")
        .build();
      console.log('❌ Contacto no encontrado');
      return res.status(404).json(response);
    }

    await Contacto.findByIdAndDelete(id);

    const response = new ResponseBuilder()
      .setCode("SUCCESS")
      .setOk(true)
      .setStatus(200)
      .setMessage("Contacto eliminado correctamente")
      .build();
    console.log('✅ Contacto eliminado correctamente');

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error al eliminar el contacto:", error);
    const response = new ResponseBuilder()
      .setOk(false)
      .setCode(500)
      .setMessage("Error al eliminar el contacto")
      .build();
    console.log('❌ Error al eliminar el contacto');
    return res.status(500).json(response);
  }
};

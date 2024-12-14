import UserRepository from "../repositories/user.repository.js";
import mongoose from "mongoose";
import {
  verifyString,
  verifyMinLength,
  verifyPhone,
  verifyEmail,
} from '../helpers/validations.helpers.js';

//Crear contacto

export const addContact = async (req, res) => {
  try {
    const user_id = req.user.id; // Obtener el ID del usuario autenticado
    const { contact_name, contact_email, contact_phone } = req.body; // Obtener los datos del contacto

    // Validaciones de los campos
    let validationError = verifyString('Nombre de contacto', contact_name);
    if (validationError) return res.status(400).json(validationError);

    validationError = verifyMinLength('Nombre de contacto', contact_name, 3); // Mínimo 3 caracteres para el nombre
    if (validationError) return res.status(400).json(validationError);

    validationError = verifyEmail('Correo electrónico de contacto', contact_email);
    if (validationError) return res.status(400).json(validationError);

    validationError = verifyPhone('Teléfono de contacto', contact_phone);
    if (validationError) return res.status(400).json(validationError);

    // Buscar al usuario por email
    const user_found = await UserRepository.findUserByEmail(contact_email);

    if (!user_found) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: 'User not found',
      });
    }


    // Buscar el usuario actual por ID
    const user = await UserRepository.findUserById(user_id);

    // Si no se encuentra el usuario actual, se devuelve un error
    if (!user) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: 'Current user not found',
      });
    }

    // Agregar contacto al usuario
    const updatedUser = await UserRepository.addContact(user_id, user_found._id);
    console.log("Usuario actualizado:", updatedUser);

    return res.status(200).json({
      ok: true,
      status: 200,
      message: 'Contact added successfully',
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




export const getAllContactsController = async (req, res) => {
  try {
    const user_id = req.user.id;  // Obtener el user_id desde el JWT decodificado
    console.log("user_id recibido:", user_id);  // Verifica que el user_id esté presente

    // Buscar al usuario y sus contactos
    const user = await UserRepository.findContacts(user_id);

    if (!user) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      ok: true,
      status: 200,
      message: 'Contacts found',
      data: {
        contacts: user.contacts
      }
    });
  } catch (error) {
    console.error("Error al obtener los contactos:", error);  // Log detallado
    return res.status(500).json({
      ok: false,
      status: 500,
      message: 'Internal server error'
    });
  }
};



export const getContactByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.user_id;  // Obtener el user_id desde el JWT decodificado
    console.log("user_id recibido:", user_id);  // Log para depuración

    const contacto = await UserRepository.findUserById(id);
    if (!contacto) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: 'Contact not found'
      });
    }

    return res.status(200).json({
      ok: true,
      status: 200,
      message: 'Contact found',
      data: contacto
    });
  } catch (error) {
    console.error("Error al obtener el contacto:", error);
    return res.status(500).json({
      ok: false,
      status: 500,
      message: 'Internal server error'
    });
  }
};



export const updateContactController = async (req, res) => {
  try {
    const { contact_id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(contact_id)) {
      return res.status(400).json({
        ok: false,
        status: 400,
        message: "Invalid ID format",
      });
    }

    const contacto = await UserRepository.findUserById(contact_id);
    if (!contacto) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: "Contact not found",
      });
    }

    const { name, email, phone } = req.body;
    contacto.name = name || contacto.name;
    contacto.email = email || contacto.email;
    contacto.phone = phone || contacto.phone;

    await contacto.save();

    return res.status(200).json({
      ok: true,
      status: 200,
      message: "Contact updated successfully",
      data: contacto,
    });
  } catch (error) {
    console.error("Error al actualizar el contacto:", error);
    return res.status(500).json({
      ok: false,
      status: 500,
      message: "Internal server error",
    });
  }
};


export const deleteContactController = async (req, res) => {
  try {
    const { user_id, contact_id } = req.params; // Asegúrate de recibir ambos ids

    const user = await UserRepository.findUserById(user_id);
    if (!user) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: 'User not found'
      });
    }

    const contact = user.contacts.find(contact => contact.toString() === contact_id);
    if (!contact) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: 'Contact not found'
      });
    }

    await UserRepository.deleteContact(user_id, contact_id); // Elimina el contacto

    return res.status(200).json({
      ok: true,
      status: 200,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    console.error("Error al eliminar el contacto:", error);
    return res.status(500).json({
      ok: false,
      status: 500,
      message: 'Internal server error'
    });
  }
};

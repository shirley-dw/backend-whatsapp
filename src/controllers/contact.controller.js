import UserRepository from "../repositories/user.repository.js";
import mongoose from "mongoose";
import { log } from "console";

//Crear contacto para un usuario

export const createContactForUser = async (req, res) => {
  try {
    const { contact_name, contact_email, contact_phone } = req.body;
    const { id: user_id } = req.params;

    // Verifico que el user_id sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ message: "ID de usuario inválido" });
    }

    // Busco el usuario que intenta agregar el contacto
    const user = await UserRepository.findUserById(user_id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Busco si el contacto ya existe por su correo electrónico
    let contact = await UserRepository.findUserByEmail(contact_email);

    if (contact) {
      // Si el contacto ya existe, aseguramos que no esté ya en los contactos del usuario
      if (!user.contacts.includes(contact._id)) {
        user.contacts.push(contact._id);
        await user.save();
      }
    } else {
      // Si el contacto no existe, creamos un nuevo contacto
      contact = await UserRepository.createUser({
        name: contact_name,
        email: contact_email,
        password: "default_password",
        emailVerified: false,
      });

      // Agregar el nuevo contacto al usuario
      user.contacts.push(contact._id);
      await user.save();
    }

    res.status(200).json({ message: "Contacto creado o asociado con éxito", contacto: contact });
  } catch (error) {
    console.error("Error al crear o asociar el contacto:", error);
    res.status(500).json({ message: "Error al crear o asociar el contacto" });
  }
};


//Obtener contactos de un usuario

export const getUserContacts = async (req, res) => {
  try {
    const user_id = req.user.id;  // Obtener el user_id desde el JWT decodificado

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
    console.error('Error al obtener los contactos:', error);
    return res.status(500).json({
      ok: false,
      status: 500,
      message: 'Internal server error'
    });
  }
};


export const getAllContactsController = async (req, res) => {
  try {
    const user_id = req.user.id;  // Obtener el user_id desde el JWT decodificado

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

// Obtener un contacto por su ID
export const getContactByIdController = async (req, res) => {
  try {
    const { contact_id } = req.params;
    const user_id = req.user.id;  // Obtener el user_id desde el JWT decodificado

    // Verifica que el contact_id sea válido
    if (!mongoose.Types.ObjectId.isValid(contact_id)) {
      return res.status(400).json({
        ok: false,
        status: 400,
        message: "Invalid ID format",
      });
    }

    // Obtén al usuario por su ID (user_id del token)
    const user = await UserRepository.findUserById(user_id);
    if (!user) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: "User not found",
      });
    }

    // Verifica si el contacto está en la lista de contactos del usuario
    const contacto = user.contacts.find(contact => contact.toString() === contact_id);

    if (!contacto) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: "Contact not found",
      });
    }

    // Aquí puedes hacer populate si quieres información más detallada del contacto
    const contactoDetails = await UserRepository.findUserById(contact_id);

    return res.status(200).json({
      ok: true,
      status: 200,
      message: "Contact found",
      data: contactoDetails,
    });
  } catch (error) {
    console.error("Error al obtener el contacto:", error);
    return res.status(500).json({
      ok: false,
      status: 500,
      message: "Internal server error",
    });
  }
};



/* export const updateContactController = async (req, res) => {
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
 */
// Eliminar un contacto
export const deleteContactController = async (req, res) => {
  try {
    const user_id = req.user.id;  // Obtener el user_id desde el JWT decodificado
    const { contact_id } = req.params;

    // Valida los IDs
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({
        ok: false,
        status: 400,
        message: "Invalid user_id format",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(contact_id)) {
      return res.status(400).json({
        ok: false,
        status: 400,
        message: "Invalid contact_id format",
      });
    }

    // Busca al usuario
    const user = await UserRepository.findUserById(user_id);
    if (!user) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: "User not found",
      });
    }

    // Verifica que el contacto exista en la lista de contactos
    const contactExists = user.contacts.some(
      (contact) => contact.toString() === contact_id
    );

    if (!contactExists) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: "Contact not found in user's contacts",
      });
    }

    // Elimina el contacto
    await UserRepository.deleteContact(user_id, contact_id);

    return res.status(200).json({
      ok: true,
      status: 200,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    console.error("Error al eliminar el contacto:", error);
    return res.status(500).json({
      ok: false,
      status: 500,
      message: "Internal server error",
    });
  }
};

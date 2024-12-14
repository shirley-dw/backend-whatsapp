import User from "../models/user.model.js";
import mongoose from 'mongoose';

class UserRepository {
    // Crea un nuevo usuario
    static async createUser(user_data) {
        return User.create(user_data);
    }

    // Agrega un contacto a la lista de contactos del usuario
    static async addContact(user_id, contact_id) {
        if (!mongoose.Types.ObjectId.isValid(contact_id)) {
            throw new Error("El contact_id no es válido");
        }

        return User.findByIdAndUpdate(user_id, {
            $push: { contacts: contact_id }
        });
    }

    // Busca un usuario por ID
    static async findUserById(user_id) {
        return User.findById(user_id);
    }

    // Busca un usuario por nombre de usuario
    static async findUserByUsername(username) {
        return User.findOne({ username: username });
    }

    // Encuentra los contactos del usuario. Se debe buscar por el ID de usuario correctamente
    static async findContacts(user_id) {
        if (!mongoose.Types.ObjectId.isValid(user_id)) {
            throw new Error("El user_id no es válido");
        }

        return User.findById(user_id).populate('contacts'); // Uso findById en vez de findOne
    }

    // Busca un usuario por su email
    static async findUserByEmail(email) {
        return User.findOne({ email: email });
    }

    // Actualiza el estado del usuario
    static async updateUserStatus(user_id, status) {
        return User.findByIdAndUpdate(user_id, {
            status: status
        }, { new: true });
    }

    // Elimina un contacto
    static async deleteContact(user_id, contact_id) {
        try {
            const user = await User.findById(user_id);
            if (!user) {
                throw new Error('User not found');
            }

            user.contacts = user.contacts.filter(contact => contact.toString() !== contact_id);
            await user.save();
            return user;
        } catch (error) {
            console.error("Error al eliminar el contacto:", error);
            throw error;
        }
    }

    // Actualiza un contacto
    static async updateContact(user_id, contact_id, updatedData) {
        try {
            const user = await User.findById(user_id);
            if (!user) {
                throw new Error('User not found');
            }

            const contactIndex = user.contacts.findIndex(contact => contact.toString() === contact_id);
            if (contactIndex === -1) {
                throw new Error('Contact not found in user contacts');
            }

            user.contacts[contactIndex] = { ...user.contacts[contactIndex].toObject(), ...updatedData };
            await user.save();
            return user;
        } catch (error) {
            console.error("Error al actualizar el contacto:", error);
            throw error;
        }
    }
}

export default UserRepository;

import User from "../models/user.model.js";

class UserRepository {
    static async createUser(user_data) {
        return User.create(user_data);
    }

    // Agrega un contacto a la lista de contactos del usuario 
    static async addContact(user_id, contact_id) {
        //El contact_id debe pertenecer a un usuario real
        return User.findByIdAndUpdate(user_id, {
            $push: {
                contacts: contact_id
            }
        })
    }

    static async findUserById(user_id) {
        return User.findById(user_id);
    }
    static async findUserByUsername(username) { return User.findOne({ username: username }); }
    static async findContacts(user_id) {
        return User.findById(user_id).populate('contacts');
    }

    static async findUserByEmail(email) {
        return User.findOne({ email: email });
    }

    static async updateUserStatus(user_id, status) {
        return User.findByIdAndUpdate(user_id, {
            status: status
        }, { new: true });
    }

    static async deleteContact(user_id, contact_id) {
        try {
            const user = await User.findById(user_id);
            if (!user) {
                throw new Error('User not found');
            }

            // Filtrar el contacto para eliminarlo
            user.contacts = user.contacts.filter(contact => contact.toString() !== contact_id);
            await user.save();
            return user;
        } catch (error) {
            console.error("Error al eliminar el contacto:", error);
            throw error;
        }
    }

    // Método para actualizar un contacto específico (por ejemplo, actualizar el nombre)
    static async updateContact(user_id, contact_id, updatedData) {
        try {
            const user = await User.findById(user_id);
            if (!user) {
                throw new Error('User not found');
            }

            // Busca el contacto dentro de la lista de contactos
            const contactIndex = user.contacts.findIndex(contact => contact.toString() === contact_id);
            if (contactIndex === -1) {
                throw new Error('Contact not found in user contacts');
            }

            // Actualizamos el contacto
            user.contacts[contactIndex] = { ...user.contacts[contactIndex].toObject(), ...updatedData };
            await user.save();
            return user;  // Retorna el usuario con el contacto actualizado
        } catch (error) {
            console.error("Error al actualizar el contacto:", error);
            throw error;
        }
    }
}

export default UserRepository;

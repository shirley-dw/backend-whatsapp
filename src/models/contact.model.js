import mongoose, { Schema } from "mongoose";

const ContactoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      ref: "Message",
    },
    text: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    fecha_creacion: {
      type: Date,
      default: Date.now,
    },
    fecha_actualizacion: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["En linea", "Desconectado"],
      default: "En linea",
    },
    messageTime: {
      type: Date,
      default: Date.now,
    },
    lastMessage: {
      type: String,
      ref: "Message",
    },
    usuario: [{
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
    ],
  },
  {
    timestamps: true,
  }
);

const Contacto = mongoose.model("Contacto", ContactoSchema);

export default Contacto;

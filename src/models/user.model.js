import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
  fecha_creacion: {
    type: Date,
    default: Date.now,
  },
  activo: {
    type: Boolean,
    default: true,
  },
  contacts: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const User = mongoose.model("User", userSchema);

export default User;

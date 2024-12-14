import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: new Date()
  },
  status: {
    type: String,
    default: 'Enviado'
  },
  day: {
    type: String,
    required: true
  },
  hour: {
    type: String,
    required: true
  }
})

const Message = mongoose.model('Message', messageSchema)

export default Message
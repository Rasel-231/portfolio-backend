import mongoose from "mongoose";

const { Schema } = mongoose;

const messageSchema = new Schema({
    name: String,
    email: String,
    subject: String,
    message: String,
    status: { type: String, enum: ['unread', 'read', 'replied'], default: 'unread' },
    createdAt: { type: Date, default: Date.now }
});

export const Message = mongoose.model('Message', messageSchema);
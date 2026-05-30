import mongoose from 'mongoose';
const { Schema } = mongoose;

const messageSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: {
        type: String,
        enum: ['unread', 'read', 'replied'],
        default: 'unread'
    },
    createdAt: { type: Date, default: Date.now }
});

export const Message = mongoose.model('Message', messageSchema);
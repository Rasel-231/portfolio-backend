import mongoose, { Schema } from "mongoose";
import { IMessage } from "./messageInterface";

const messageSchema = new Schema<IMessage>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },

    status: {
        type: String,
        enum: ["unread", "read", "replied"],
        default: "unread",
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Message =
    mongoose.models.Message ||
    mongoose.model<IMessage>("Message", messageSchema);
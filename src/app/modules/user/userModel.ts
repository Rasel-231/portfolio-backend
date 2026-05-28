import { Schema, model } from 'mongoose';

import bcrypt from 'bcrypt';
import config from '../../config';
import { IUser } from './userInterface';


const userSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: 0 },
        role: { type: String, enum: ['ADMIN', 'USER', 'AI_CHAT_AGENT'], default: 'USER' },
        passwordResetToken: { type: String, default: null },
        passwordResetExpires: { type: Date, default: null },
    },
    { timestamps: true }
);

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password!, Number(config.bcrypt_salt_rounds));
});

export const User = model<IUser>('User', userSchema);
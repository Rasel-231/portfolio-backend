export type USER_ROLES = 'ADMIN' | 'USER' | 'AI_CHAT_AGENT';

export type IUser = {
    email: string;
    password?: string;
    role: USER_ROLES;
    passwordResetToken?: string | null;
    passwordResetExpires?: Date | null;
};
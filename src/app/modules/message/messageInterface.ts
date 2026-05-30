export interface IMessage {
    name: string;
    email: string;
    subject: string;
    message: string;
    status?: "unread" | "read" | "replied";
    isSupport?: boolean;
    createdAt?: Date;
}

export interface ISupportReply {
    name: string;
    email: string;
    message: string;
}
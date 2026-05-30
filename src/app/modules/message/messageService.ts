import { Message } from "./messageModel";
const createMessage = async (data: any) => {
    return await Message.create(data);
};

const getMessages = async () => {
    return await Message.find().sort({ createdAt: -1 });
};


const updateMessageStatus = async (id: string, status: string) => {
    return await Message.findByIdAndUpdate(
        id,
        { status },
        { new: true }
    );
};


const deleteMessage = async (id: string) => {
    return await Message.findByIdAndDelete(id);
};

export const messageService = {
    createMessage,
    getMessages,
    updateMessageStatus,
    deleteMessage
};
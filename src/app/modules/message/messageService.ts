
import { sendEmail } from "../../Utils/Email/SendMailer";
import { IMessage, ISupportReply } from "./messageInterface";
import { Message } from "./messageModel";
const createMessage = async (data: any) => {
    return await Message.create(data);
};

const getMessages = async () => {
    return await Message.find().sort({ createdAt: -1 });
};

const supportReply = async (
    id: string,
    replyData: ISupportReply
): Promise<IMessage | null> => {

    const existingMessage = await Message.findById(id);

    if (!existingMessage) {
        return null;
    }

    const emailBody = `
    <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
      <h2>Hi ${existingMessage.name},</h2>

      <div style="
        background:#f9f9f9;
        padding:15px;
        border-radius:8px;
        border-left:5px solid #10b981;
        margin:20px 0;
      ">
        ${replyData.message}
      </div>

      <p>If you have further questions, feel free to reply to this email.</p>

      <br/>

      <p>
        Best Regards,<br/>
        <strong>RaselHub Support Team</strong>
      </p>
    </div>
  `;

    await sendEmail(
        existingMessage.email,
        "Update regarding your inquiry - RaselHub",
        emailBody
    );

    existingMessage.status = "replied";
    await existingMessage.save();

    return existingMessage;
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
    supportReply,
    updateMessageStatus,
    deleteMessage
};
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendReponse";
import { messageService } from "./messageService";

const getAllMessages = catchAsync(async (req, res) => {
    const messages = await messageService.getMessages();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Messages retrieved successfully",
        data: messages
    });
});

const createMessage = catchAsync(async (req, res) => {
    const newMessage = await messageService.createMessage(req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Message created successfully",
        data: newMessage
    });
});

const updateMessage = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await messageService.updateMessageStatus(id as string, status);

    if (!updated) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Message not found"
        });
    }

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Message updated successfully",
        data: updated
    });
});

const deleteMessage = catchAsync(async (req, res) => {
    const { id } = req.params;
    const deleted = await messageService.deleteMessage(id as string);

    if (!deleted) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Message not found to delete"
        });
    }

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Message deleted successfully"
    });
});

export const messageController = {
    getAllMessages,
    createMessage,
    updateMessage,
    deleteMessage
};
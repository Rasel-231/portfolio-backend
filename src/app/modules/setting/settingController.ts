import { Request, Response } from "express";
import { settingsService } from "./settingService";
import sendResponse from "../../shared/sendReponse";
import https from "https";

const createProject = async (req: Request, res: Response) => {
    if (!req.file) {
        return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: "Image is required",
        });
    }
    const result = await settingsService.createProject(req.body, req.file);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Project created successfully",
        data: result,
    });
};

const getAllProjects = async (_req: Request, res: Response) => {
    const result = await settingsService.getAllProjects();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Projects retrieved",
        data: result,
    });
};

const deleteProject = async (req: Request, res: Response) => {
    await settingsService.deleteProject(req.params.id as any);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Project deleted successfully",
    });
};

const uploadFile = async (req: Request, res: Response) => {
    if (!req.file) {
        return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: "File is required",
        });
    }
    const result = await settingsService.uploadFile(req.file);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "File uploaded successfully",
        data: result,
    });
};

const getAllFiles = async (_req: Request, res: Response) => {
    const result = await settingsService.getAllFiles();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Files retrieved",
        data: result,
    });
};

const deleteFile = async (req: Request, res: Response) => {
    await settingsService.deleteFile(req.params.id as any);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "File deleted successfully",
    });
};

// Force download — redirect follow করে raw file stream করে
const downloadFile = (req: Request, res: Response) => {
    settingsService
        .getFile(req.params.id as any)
        .then((file) => {
            if (!file) {
                return res
                    .status(404)
                    .json({ success: false, message: "File not found" });
            }

            res.setHeader(
                "Content-Disposition",
                `attachment; filename="${encodeURIComponent(file.originalName)}"`
            );
            res.setHeader("Content-Type", "application/octet-stream");

            // https.get redirect follow করে না, তাই manually handle করি
            const makeRequest = (url: string) => {
                https
                    .get(url, (stream) => {
                        // Cloudinary redirect দিলে নতুন URL follow করি
                        if (
                            stream.statusCode &&
                            stream.statusCode >= 300 &&
                            stream.statusCode < 400 &&
                            stream.headers.location
                        ) {
                            return makeRequest(stream.headers.location);
                        }

                        if (stream.statusCode !== 200) {
                            return res.status(500).json({
                                success: false,
                                message: "Download failed",
                            });
                        }

                        stream.pipe(res);
                    })
                    .on("error", (error) => {
                        console.error("Download Error:", error.message);
                        return res
                            .status(500)
                            .json({ success: false, message: "Download failed" });
                    });
            };

            makeRequest(file.secureUrl);
        })
        .catch((error) => {
            console.error("Download Error:", error?.message);
            return res
                .status(500)
                .json({ success: false, message: "Download failed" });
        });
};

export const settingsController = {
    createProject,
    getAllProjects,
    deleteProject,
    uploadFile,
    getAllFiles,
    deleteFile,
    downloadFile,
};
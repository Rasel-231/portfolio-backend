import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import config from "../config";

// Cloudinary Configuration
cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret,
});

// Raw file MIME types (PDF, Word, Excel)
const RAW_MIME_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

// 1. Local Storage Setup
const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        const uploadPath = path.join(process.cwd(), "uploads");
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (_req, file, cb) {
        const originalName = file.originalname.split(".")[0];
        const extension = path.extname(file.originalname);
        const uniqueName = `${originalName}-${Date.now()}${extension}`;
        cb(null, uniqueName);
    },
});

// 2. File Filter (Validation)
const fileFilter = (_req: any, file: Express.Multer.File, cb: any) => {
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        ...RAW_MIME_TYPES,
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only Image, PDF, DOCX and Excel files are allowed!"), false);
    }
};

// 3. Multer Middleware Instance
const multerInstance = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// 4. Upload methods
const upload = {
    single: (fieldName: string) => multerInstance.single(fieldName),
    array: (fieldName: string, maxCount: number) =>
        multerInstance.array(fieldName, maxCount),
};

// 5. Upload to Cloudinary
const uploadToCloudinary = async (
    file: Express.Multer.File
): Promise<UploadApiResponse | undefined> => {
    try {
        const isRaw = RAW_MIME_TYPES.includes(file.mimetype);
        const resourceType = isRaw ? "raw" : "image";

        const uploadResult = await cloudinary.uploader.upload(file.path, {
            resource_type: resourceType,
            folder: "portfolio_files",
            // use_filename রাখলে original নাম থাকে, unique_filename conflict এড়ায়
            use_filename: false,
            unique_filename: true,
        });

        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }

        return uploadResult;
    } catch (error) {
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }
        console.error("Cloudinary Upload Error:", error);
        return undefined;
    }
};

// 6. Delete from Cloudinary
const destroy = async (
    publicId: string,
    resourceType: "image" | "video" | "raw" | "auto"
) => {
    return await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
    });
};

export const fileUploader = {
    upload,
    destroy,
    uploadToCloudinary,
    RAW_MIME_TYPES,
};
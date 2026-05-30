import { fileUploader } from "../../shared/fileUploader";
import { IProject } from "./settingInterface";
import { FileModel, ProjectModel, VisitModel } from "./settingModel";

// --- Project Service ---
// const createProject = async (data: IProject, file: Express.Multer.File) => {
//     if (!file) throw new Error("Image required");

//     const result = await fileUploader.uploadToCloudinary(file);
//     if (!result) throw new Error("Cloudinary upload failed");

//     return await ProjectModel.create({
//         title: data.title,
//         description: data.description,
//         technology: data.technology,
//         liveLink: data.liveLink,
//         githubLink: data.githubLink,
//         image: {
//             url: result.secure_url,
//             publicId: result.public_id,
//         },
//     });
// };
const createProject = async (data: IProject, file: Express.Multer.File) => {
    if (!file) throw new Error("Image required");

    const result = await fileUploader.uploadToCloudinary(file);
    if (!result) throw new Error("Cloudinary upload failed");

    // ডাটাবেজে সেভ করার সময় সরাসরি spread operator ব্যবহার করা যায়
    return await ProjectModel.create({
        ...data, // এতে title, description, technology, liveLink, githubLink অটোমেটিক চলে আসবে
        image: {
            url: result.secure_url,
            publicId: result.public_id,
        },
    });
};

const getAllProjects = async () => {
    return await ProjectModel.find().sort({ createdAt: -1 });
};

const deleteProject = async (id: string) => {
    const project = await ProjectModel.findById(id);
    if (!project) throw new Error("Project not found");

    // এখানে fileUploader এর destroy মেথড ব্যবহার করা হয়েছে
    await fileUploader.destroy(project.image.publicId, "image");

    return await ProjectModel.findByIdAndDelete(id);
};

// --- File Service (CV/Documents) ---
const uploadFile = async (file: Express.Multer.File) => {
    const result = await fileUploader.uploadToCloudinary(file);
    if (!result) throw new Error("Cloudinary upload failed");

    const normalizedResourceType = file.mimetype === 'application/pdf' ? "raw" : "image";
    return await FileModel.create({
        originalName: file.originalname,
        secureUrl: result.secure_url,
        publicId: result.public_id,
        resourceType: normalizedResourceType, // 'image' বা 'raw'
    });
};

const getAllFiles = async () => {
    return await FileModel.find().sort({ createdAt: -1 });
};

const getFile = async (id: string) => {
    return await FileModel.findById(id);
};
const incrementDownloadCount = async (id: string) => {
    return await FileModel.findByIdAndUpdate(
        id,
        { $inc: { downloadCount: 1 } },
        { new: true }
    );
};
const deleteFile = async (id: string) => {
    const file = await FileModel.findById(id);
    if (!file) throw new Error("File not found");
    await fileUploader.destroy(file.publicId, file.resourceType as any);

    return await FileModel.findByIdAndDelete(id);
};



const trackVisit = async (name: string) => {
    return await VisitModel.findOneAndUpdate(
        { name: "portfolioVisit" },
        { $inc: { count: 1 } },
        { new: true, upsert: true }
    );
};
const getDashboardStats = async () => {
    const totalVisits = await VisitModel.findOne({ name: "portfolioVisit" });
    const cvDownloads = await FileModel.aggregate([{ $group: { _id: null, total: { $sum: "$downloadCount" } } }]);
    const totalProjects = await ProjectModel.countDocuments();

    return {
        totalVisits,
        cvDownloads,
        totalProjects,
        offers: 0
    };
};
export const settingsService = {
    createProject,
    getAllProjects,
    deleteProject,
    uploadFile,
    getAllFiles,
    getFile,
    trackVisit,
    deleteFile,
    getDashboardStats,
    incrementDownloadCount,
};
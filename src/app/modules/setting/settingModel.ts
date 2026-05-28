import { Schema, model, Document, Model } from "mongoose";
import { IFile, IProject } from "./settingInterface";

// Project Schema
const projectSchema = new Schema<IProject & Document>(
    {
        title: { type: String, required: true },
        liveLink: { type: String, required: true },
        githubLink: { type: String, required: true },
        description: { type: String },
        technology: { type: [String], default: [] },
        image: {
            url: { type: String, required: true },
            publicId: { type: String, required: true },
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// File Schema (CV বা অন্য ফাইলের জন্য)
const fileSchema = new Schema<IFile & Document>(
    {
        originalName: { type: String, required: true },
        secureUrl: { type: String, required: true },
        publicId: { type: String, required: true },
        resourceType: {
            type: String,
            enum: ["image", "raw"], // 'raw' হলো PDF, Docx ইত্যাদির জন্য
            required: true
        },
    },
    {
        timestamps: true
    }
);

// Mongoose Models
export const ProjectModel = model<IProject & Document>("Project", projectSchema);
export const FileModel = model<IFile & Document>("File", fileSchema);
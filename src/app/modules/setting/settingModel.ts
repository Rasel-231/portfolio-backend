import { Schema, model, Document, models } from "mongoose";
import { IFile, IProject, IVisit } from "./settingInterface";

const projectSchema = new Schema<IProject & Document>(
    {
        title: { type: String, required: true },
        liveLink: { type: String, required: true },
        githubLink: { type: String, required: false },
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


const fileSchema = new Schema<IFile & Document>(
    {
        originalName: { type: String, required: true },
        secureUrl: { type: String, required: true },
        publicId: { type: String, required: true },
        downloadCount: { type: Number, default: 0 },
        resourceType: {
            type: String,
            enum: ["image", "raw"],
            required: true
        },
    },
    {
        timestamps: true
    }
);

const visitSchema = new Schema<IVisit>({
    name: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 },
}, { timestamps: true });


export const ProjectModel = model<IProject & Document>("Project", projectSchema);
export const FileModel = model<IFile & Document>("File", fileSchema);
export const VisitModel = models.VisitModel || model<IVisit>("VisitModel", visitSchema);
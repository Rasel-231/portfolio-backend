import { z } from "zod";


export const ProjectValidationSchema = z.object({
    title: z.string().nonempty("Title is required"),
    liveLink: z.string().url("Invalid Live Link URL"),
    githubLink: z.string().url("Invalid GitHub Link URL"),
});



export const FileValidationSchema = z.object({
    originalName: z.string().min(1),
    secureUrl: z.string().url(),
    publicId: z.string(),
    resourceType: z.enum(["image", "raw"]),
});
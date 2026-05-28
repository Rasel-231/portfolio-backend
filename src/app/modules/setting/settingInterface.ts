// interfaces/common.interface.ts

export interface IImage {
    url: string;
    publicId: string;
}

export interface IProject {
    title: string;
    description?: string;
    technology?: string[];
    liveLink: string;
    githubLink: string;
    image: IImage;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IFile {
    originalName: string;
    secureUrl: string;
    publicId: string;
    resourceType: "image" | "raw";
    createdAt?: Date;
    updatedAt?: Date;
}
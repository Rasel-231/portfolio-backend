import express from "express";
import { fileUploader } from "../../shared/fileUploader";
import { settingsController } from "./settingController";

const router = express.Router();

// --- Project Routes ---
router.post(
    "/upload-project",
    fileUploader.upload.single("image"),
    (req, _res, next) => {
        if (req.body.data) {
            req.body = JSON.parse(req.body.data);
        }
        next();
    },
    settingsController.createProject
);

router.get("/projects", settingsController.getAllProjects);
router.delete("/project/:id", settingsController.deleteProject);

// --- File Routes ---
router.post(
    "/upload-cv",
    fileUploader.upload.single("file"),
    settingsController.uploadFile
);
router.get("/files", settingsController.getAllFiles);
router.delete("/file/:id", settingsController.deleteFile);
router.get("/download/:id", settingsController.downloadFile);
router.post("/visit/:name", settingsController.visitTracker);
router.get("/stats", settingsController.dahsboardStats);

export const settingsRoutes = router;
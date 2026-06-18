import { Router } from "express";
import { uploadCV } from "../config/multer.js";
import { submitApplication, getApplications, deleteApplication } from "../controllers/application.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

router.post("/", uploadCV.single("cv"), submitApplication);
router.get("/", authenticate, getApplications);
router.delete("/:id", authenticate, deleteApplication);

export default router;

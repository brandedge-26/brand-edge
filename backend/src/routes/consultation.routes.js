import { Router } from "express";
import { submitConsultation, getConsultations, updateConsultationStatus, deleteConsultation } from "../controllers/consultation.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

router.post("/", submitConsultation);
router.get("/", authenticate, getConsultations);
router.patch("/:id/status", authenticate, updateConsultationStatus);
router.delete("/:id", authenticate, deleteConsultation);

export default router;

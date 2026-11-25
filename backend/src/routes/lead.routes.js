import { Router } from "express";
import { getLeads, getLeadStats, getLeadDetail, updateLeadStatus, deleteLead } from "../controllers/lead.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

router.get("/", authenticate, getLeads);
router.get("/stats", authenticate, getLeadStats);
router.get("/:id", authenticate, getLeadDetail);
router.patch("/:id", authenticate, updateLeadStatus);
router.delete("/:id", authenticate, deleteLead);

export default router;

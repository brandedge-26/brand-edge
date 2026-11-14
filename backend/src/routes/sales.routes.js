import { Router } from "express";
import { salesLogin, salesLogout, getSalesMe } from "../controllers/salesAuth.controller.js";
import { getMyLeads, getMyLeadDetail, logCall } from "../controllers/salesLead.controller.js";
import { getMyDashboard } from "../controllers/salesDashboard.controller.js";
import { createClient, getMyClients, updateClient, markFollowUp, closeClient } from "../controllers/salesClient.controller.js";
import { upsertMyReport, getMyReports } from "../controllers/salesReport.controller.js";
import { authenticateSales } from "../middlewares/authenticateSales.js";

const router = Router();

router.post("/login", salesLogin);
router.post("/logout", salesLogout);
router.get("/me", authenticateSales, getSalesMe);
router.get("/leads", authenticateSales, getMyLeads);
router.get("/leads/:source/:id", authenticateSales, getMyLeadDetail);
router.post("/leads/:source/:id/call", authenticateSales, logCall);
router.get("/dashboard", authenticateSales, getMyDashboard);
router.post("/clients", authenticateSales, createClient);
router.get("/clients", authenticateSales, getMyClients);
router.patch("/clients/:id", authenticateSales, updateClient);
router.patch("/clients/:id/follow-up", authenticateSales, markFollowUp);
router.patch("/clients/:id/close", authenticateSales, closeClient);
router.post("/reports", authenticateSales, upsertMyReport);
router.get("/reports", authenticateSales, getMyReports);

export default router;

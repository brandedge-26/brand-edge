import { Router } from "express";
import { createSalesRep, getSalesReps, getSalesRep, toggleSalesRepActive, deleteSalesRep, getSalesRepStats, getSalesRepLeads, getSalesRepCalls, getSalesRepClients, getSalesRepReports } from "../controllers/salesRep.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

router.get("/", authenticate, getSalesReps);
router.post("/", authenticate, createSalesRep);
router.get("/:id", authenticate, getSalesRep);
router.patch("/:id/active", authenticate, toggleSalesRepActive);
router.delete("/:id", authenticate, deleteSalesRep);
router.get("/:id/stats", authenticate, getSalesRepStats);
router.get("/:id/leads", authenticate, getSalesRepLeads);
router.get("/:id/calls", authenticate, getSalesRepCalls);
router.get("/:id/clients", authenticate, getSalesRepClients);
router.get("/:id/reports", authenticate, getSalesRepReports);

export default router;

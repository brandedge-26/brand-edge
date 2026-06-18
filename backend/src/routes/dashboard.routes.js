import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboard.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

router.get("/", authenticate, getDashboardStats);

export default router;

import { Router } from "express";
import { getJobs, createJob, deleteJob, updateJob } from "../controllers/job.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

router.get("/", getJobs);
router.post("/", authenticate, createJob);
router.delete("/:id", authenticate, deleteJob);
router.patch("/:id", authenticate, updateJob);

export default router;

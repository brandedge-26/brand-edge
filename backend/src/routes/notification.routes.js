import { Router } from "express";
import { getNotifications, markRead, markAllRead, deleteNotification } from "../controllers/notification.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

router.get("/", authenticate, getNotifications);
router.patch("/read-all", authenticate, markAllRead);
router.patch("/:id/read", authenticate, markRead);
router.delete("/:id", authenticate, deleteNotification);

export default router;

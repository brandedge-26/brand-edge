import { Router } from "express";
import { submitContact, getContacts, deleteContact } from "../controllers/contact.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

router.post("/", submitContact);
router.get("/", authenticate, getContacts);
router.delete("/:id", authenticate, deleteContact);

export default router;

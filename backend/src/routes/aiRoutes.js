import express from "express";
import {
  chatWithDoc,
  summarizeDoc,
  explainDocConcept,
} from "../controllers/aiController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.post("/chat", chatWithDoc);
router.post("/summary", summarizeDoc);
router.post("/explain", explainDocConcept);

export default router;
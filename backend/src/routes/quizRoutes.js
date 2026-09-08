
import express from "express";
import {
  getQuizzesByDocument,
  getQuizById,
  createQuiz,
  submitQuizScore,
  deleteQuiz,
} from "../controllers/quizController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

// Fetch quizzes for a document
router.get("/document/:documentId", getQuizzesByDocument);

// Single quiz actions
router.get("/:id", getQuizById);
router.post("/generate", createQuiz);
router.post("/:id/submit", submitQuizScore);
router.delete("/:id", deleteQuiz);

export default router;
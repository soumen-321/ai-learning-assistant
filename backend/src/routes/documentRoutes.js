

import express from "express";
import {
  uploadDocument,
  getMyDocuments,
  getDocumentById,
  deleteDocument,
  chatWithDocument,
  getChatHistory,
  getDocumentSummary,            // <-- Added
  explainConceptFromDocument,    // <-- Added
  createFlashcards,
  getFlashcardsByDocument,
  createQuiz,
  getQuizByDocument,
  submitQuizScore,
  getDashboardStats,
} from "../controllers/documentController.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.use(protect);

// 1. Static endpoints (MUST be defined before /:id parameter routes)
router.get("/user/stats", getDashboardStats);

// 2. Document CRUD
router.post("/upload", upload.single("file"), uploadDocument);
router.get("/", getMyDocuments);

// 3. Document-specific actions
// Chat History & Querying
router.get("/:id/chat", getChatHistory);
router.post("/:id/chat", chatWithDocument);

// AI Actions (Summary & Explanations)
router.post("/:id/summary", getDocumentSummary);             // <-- Added
router.post("/:id/explain", explainConceptFromDocument);     // <-- Added

// Flashcards
router.get("/:id/flashcards", getFlashcardsByDocument);
router.post("/:id/flashcards", createFlashcards);

// Quizzes
router.get("/:id/quiz", getQuizByDocument);
router.post("/:id/quiz", createQuiz);
router.post("/quiz/:quizId/submit", submitQuizScore);

// 4. Parameterized base routes (Placed after static routes)
router.get("/:id", getDocumentById);
router.delete("/:id", deleteDocument);

export default router;

import express from "express";
import {
  getAllFlashcardSets,
  getFlashcardSetById, // <-- imported
  getSetsByDocument,
  createFlashcardSet,
  deleteFlashcardSet,
} from "../controllers/flashcardController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

// 1. Get all sets for user (/flashcards page)
router.get("/", getAllFlashcardSets);

// 2. Get all sets for a specific document
router.get("/document/:documentId", getSetsByDocument);

// 3. Get single flashcard set by ID (study view)
router.get("/:id", getFlashcardSetById);

// 4. Generate a new set
router.post("/generate", createFlashcardSet);

// 5. Delete an individual deck
router.delete("/:id", deleteFlashcardSet);

export default router;
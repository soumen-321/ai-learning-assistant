


import FlashcardSet from "../models/Flashcard.js";
import Document from "../models/Document.js";
import { generateFlashcards } from "../services/geminiService.js";

const getUserId = (req) => req.user?._id || req.user?.id;

// GET /api/flashcards - Get all decks across all documents for the logged-in user
export const getAllFlashcardSets = async (req, res) => {
  try {
    const userId = getUserId(req);
    const sets = await FlashcardSet.find({ userId })
      .populate("documentId", "title")
      .sort({ createdAt: -1 });

    return res.status(200).json(sets);
  } catch (error) {
    console.error("Fetch all flashcard decks error:", error);
    return res.status(500).json({ message: "Failed to fetch flashcard decks" });
  }
};

// GET /api/flashcards/:id - Get a single flashcard set by ID (used by study view)
export const getFlashcardSetById = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    const set = await FlashcardSet.findOne({ _id: id, userId }).populate("documentId", "title");

    if (!set) {
      return res.status(404).json({ message: "Flashcard set not found" });
    }

    return res.status(200).json(set);
  } catch (error) {
    console.error("Fetch single flashcard set error:", error);
    return res.status(500).json({ message: "Failed to load flashcard set" });
  }
};

// GET /api/flashcards/document/:documentId - Get all decks linked to a single document
export const getSetsByDocument = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { documentId } = req.params;

    const sets = await FlashcardSet.find({
      documentId,
      userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json(sets);
  } catch (error) {
    console.error("Fetch document flashcard decks error:", error);
    return res.status(500).json({ message: "Failed to load document flashcards" });
  }
};

// POST /api/flashcards/generate - Creates a brand new, independent deck entry
export const createFlashcardSet = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { documentId, title } = req.body;

    if (!documentId) {
      return res.status(400).json({ message: "documentId is required" });
    }

    const document = await Document.findOne({ _id: documentId, userId });
    if (!document || !document.extractedText) {
      return res.status(400).json({ message: "No readable document text available" });
    }

    const cards = await generateFlashcards(document.extractedText);

    // Save as a separate record in MongoDB
    const newDeck = await FlashcardSet.create({
      userId,
      documentId: document._id,
      title: title || `${document.title} Deck`,
      cards,
    });

    return res.status(201).json(newDeck);
  } catch (error) {
    console.error("Create flashcard deck error:", error);
    return res.status(500).json({ message: error.message || "Flashcard generation failed" });
  }
};

// DELETE /api/flashcards/:id - Delete an individual flashcard set
export const deleteFlashcardSet = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    const deletedSet = await FlashcardSet.findOneAndDelete({ _id: id, userId });
    if (!deletedSet) {
      return res.status(404).json({ message: "Flashcard set not found" });
    }

    return res.status(200).json({ message: "Flashcard deck removed successfully" });
  } catch (error) {
    console.error("Delete flashcard deck error:", error);
    return res.status(500).json({ message: "Failed to delete flashcard deck" });
  }
};




import fs from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfModule = require("pdf-parse");

import mongoose from "mongoose";
import Document from "../models/Document.js";
import FlashcardSet from "../models/Flashcard.js";
import Quiz from "../models/Quiz.js";
import ChatHistory from "../models/ChatHistory.js";
import {
  askDocumentQuestion,
  generateFlashcards,
  generateQuiz,
  generateSummary,
  explainConcept,
} from "../services/geminiService.js";

// Helper: Safely resolve User ID from any auth token shape
const getUserId = (req) =>
  req.user?._id?.toString() || req.user?.id?.toString() || req.user?.userId?.toString();

// Universal PDF text extractor supporting both pdf-parse v1 and v2
const extractTextFromBuffer = async (dataBuffer) => {
  try {
    // 1. pdf-parse v2 (Class based)
    const PDFClass = pdfModule.PDFParse || (typeof pdfModule === "function" && pdfModule.prototype?.getText ? pdfModule : null);
    if (PDFClass) {
      const parser = new PDFClass({ data: dataBuffer });
      const result = await parser.getText();
      if (parser.destroy) await parser.destroy();
      return result?.text ? result.text.trim() : "";
    }

    // 2. pdf-parse v1 (Function based)
    if (typeof pdfModule === "function") {
      const result = await pdfModule(dataBuffer);
      return result?.text ? result.text.trim() : "";
    }

    // 3. Fallback for default export wrappers
    if (typeof pdfModule.default === "function") {
      const result = await pdfModule.default(dataBuffer);
      return result?.text ? result.text.trim() : "";
    }
  } catch (err) {
    console.error("[PDF Parse Engine Error]:", err.message);
  }
  return "";
};

// GET /api/documents/user/stats - User Workspace Dashboard Statistics
export const getDashboardStats = async (req, res) => {
  try {
    const userId = getUserId(req);

    const [totalDocuments, totalFlashcardSets, totalQuizzes] = await Promise.all([
      Document.countDocuments({ userId }),
      FlashcardSet.countDocuments({ userId }),
      Quiz.countDocuments({ userId }),
    ]);

    return res.status(200).json({
      totalDocuments: totalDocuments || 0,
      totalFlashcardSets: totalFlashcardSets || 0,
      totalQuizzes: totalQuizzes || 0,
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return res.status(500).json({ message: error.message || "Failed to fetch stats" });
  }
};

// Upload document (with PDF text parsing)
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = getUserId(req);
    const { title } = req.body;

    const dataBuffer = fs.readFileSync(req.file.path);
    const parsedText = await extractTextFromBuffer(dataBuffer);

    console.log(`[Upload Diagnostic] Extracted ${parsedText.length} characters from "${req.file.originalname}"`);

    if (!parsedText || parsedText.length < 20) {
      return res.status(400).json({
        message: "No readable digital text found in this PDF. If this is a scan or image, please use a digital text document.",
      });
    }

    const document = await Document.create({
      userId,
      title: title || req.file.originalname,
      fileName: req.file.filename,
      filePath: req.file.path,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      extractedText: parsedText,
    });

    return res.status(201).json(document);
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: error.message || "File upload failed" });
  }
};

// Get all documents for logged-in user
export const getMyDocuments = async (req, res) => {
  try {
    const userId = getUserId(req);
    const documents = await Document.find({ userId }).sort({ createdAt: -1 }).lean();

    const documentsWithCounts = await Promise.all(
      documents.map(async (doc) => {
        const [flashcardCount, quizCount] = await Promise.all([
          FlashcardSet.countDocuments({ documentId: doc._id, userId }),
          Quiz.countDocuments({ documentId: doc._id, userId }),
        ]);

        return {
          ...doc,
          flashcardCount: flashcardCount || 0,
          quizCount: quizCount || 0,
        };
      })
    );

    return res.status(200).json(documentsWithCounts);
  } catch (error) {
    console.error("Failed to fetch documents:", error);
    return res.status(500).json({ message: error.message || "Failed to fetch documents" });
  }
};

// Get single document by ID
export const getDocumentById = async (req, res) => {
  try {
    const userId = getUserId(req);
    const document = await Document.findOne({
      _id: req.params.id,
      userId,
    });

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    return res.status(200).json(document);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to fetch document" });
  }
};

// Delete document and cascades
export const deleteDocument = async (req, res) => {
  try {
    const userId = getUserId(req);
    const document = await Document.findOne({
      _id: req.params.id,
      userId,
    });

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (document.filePath && fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    await Promise.all([
      FlashcardSet.deleteMany({ documentId: document._id }),
      Quiz.deleteMany({ documentId: document._id }),
      ChatHistory.deleteMany({ documentId: document._id }),
      Document.findByIdAndDelete(document._id),
    ]);

    return res.status(200).json({ message: "Document and associated assets deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Delete failed" });
  }
};

// GET /api/documents/:id/chat - Load existing chat history
export const getChatHistory = async (req, res) => {
  try {
    const userId = getUserId(req);
    const documentId = req.params.id;

    if (!userId || !documentId || !mongoose.Types.ObjectId.isValid(documentId)) {
      return res.status(200).json([]);
    }

    const history = await ChatHistory.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      documentId: new mongoose.Types.ObjectId(documentId),
    }).lean();

    return res.status(200).json(history?.messages || []);
  } catch (error) {
    console.error("Fetch chat history error:", error);
    return res.status(500).json({ message: error.message || "Failed to load chat history" });
  }
};

// POST /api/documents/:id/chat - Chat with document & save to history
export const chatWithDocument = async (req, res) => {
  try {
    const userId = getUserId(req);
    const documentId = req.params.id;
    const { question } = req.body;

    const document = await Document.findOne({ _id: documentId, userId });
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const answer = await askDocumentQuestion(document.extractedText || "", question);

    await ChatHistory.findOneAndUpdate(
      {
        userId: new mongoose.Types.ObjectId(userId),
        documentId: new mongoose.Types.ObjectId(documentId),
      },
      {
        $push: {
          messages: [
            { sender: "user", text: question, timestamp: new Date() },
            { sender: "ai", text: answer, timestamp: new Date() },
          ],
        },
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({ answer });
  } catch (error) {
    console.error("Chat error:", error);
    return res.status(500).json({ message: error.message || "Chat failed" });
  }
};

// POST /api/documents/:id/summary - Summarize document context
export const getDocumentSummary = async (req, res) => {
  try {
    const userId = getUserId(req);
    const document = await Document.findOne({ _id: req.params.id, userId });

    if (!document || !document.extractedText) {
      return res.status(400).json({ message: "No readable document text available to summarize" });
    }

    const summary = await generateSummary(document.extractedText);
    return res.status(200).json({ summary });
  } catch (error) {
    console.error("Document Summary Error:", error);
    return res.status(500).json({ message: error.message || "Failed to generate summary" });
  }
};

// POST /api/documents/:id/explain - Explain specific concept from context
export const explainConceptFromDocument = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { concept } = req.body;

    const document = await Document.findOne({ _id: req.params.id, userId });
    if (!document || !document.extractedText) {
      return res.status(400).json({ message: "No readable document text available" });
    }

    const explanation = await explainConcept(document.extractedText, concept);
    return res.status(200).json({ explanation });
  } catch (error) {
    console.error("Explain Concept Error:", error);
    return res.status(500).json({ message: error.message || "Failed to explain concept" });
  }
};

// Flashcards inside document viewer
export const getFlashcardsByDocument = async (req, res) => {
  try {
    const userId = getUserId(req);
    const flashcardSet = await FlashcardSet.findOne({
      documentId: req.params.id,
      userId,
    });
    return res.status(200).json(flashcardSet ? flashcardSet.cards : []);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to fetch flashcards" });
  }
};

export const createFlashcards = async (req, res) => {
  try {
    const userId = getUserId(req);
    const document = await Document.findOne({
      _id: req.params.id,
      userId,
    });

    if (!document || !document.extractedText) {
      return res.status(400).json({ message: "No text available for flashcards" });
    }

    const cards = await generateFlashcards(document.extractedText);

    const flashcardSet = await FlashcardSet.findOneAndUpdate(
      { documentId: document._id, userId },
      {
        userId,
        documentId: document._id,
        title: `${document.title} Deck`,
        cards,
      },
      { new: true, upsert: true }
    );

    return res.status(200).json(flashcardSet.cards);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Flashcard generation failed" });
  }
};

// Quiz: Get saved quiz for a document
export const getQuizByDocument = async (req, res) => {
  try {
    const userId = getUserId(req);
    const quiz = await Quiz.findOne({
      documentId: req.params.id,
      userId,
    });
    return res.status(200).json(quiz || null);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to fetch quiz" });
  }
};

// Quiz: Generate with Gemini and persist to MongoDB
export const createQuiz = async (req, res) => {
  try {
    const userId = getUserId(req);
    const documentId = req.params.id;

    const document = await Document.findOne({ _id: documentId, userId });
    if (!document || !document.extractedText) {
      return res.status(400).json({ message: "No readable document text available" });
    }

    const rawQuestions = await generateQuiz(document.extractedText);

    const cleanQuestions = (Array.isArray(rawQuestions) ? rawQuestions : []).map((q) => {
      const options = Array.isArray(q.options) ? q.options.map(String) : [];
      let correctIndex = 0;

      if (typeof q.correctIndex === "number") {
        correctIndex = Math.min(Math.max(q.correctIndex, 0), Math.max(options.length - 1, 0));
      }

      return {
        question: String(q.question || q.text || "Question"),
        options,
        correctIndex,
        explanation: String(q.explanation || ""),
      };
    });

    const quiz = await Quiz.findOneAndUpdate(
      { documentId: document._id, userId },
      {
        userId,
        documentId: document._id,
        title: `${document.title} Quiz`,
        questions: cleanQuestions,
        score: null,
        completed: false,
      },
      { new: true, upsert: true }
    );

    return res.status(200).json(quiz);
  } catch (error) {
    console.error("Quiz creation error:", error);
    return res.status(500).json({ message: error.message || "Quiz generation failed" });
  }
};

// Quiz: Submit score
export const submitQuizScore = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { score } = req.body;
    const quiz = await Quiz.findOneAndUpdate(
      { _id: req.params.quizId, userId },
      { score, completed: true },
      { new: true }
    );

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    return res.status(200).json(quiz);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to submit score" });
  }
};
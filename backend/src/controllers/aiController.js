import Document from "../models/Document.js";
import {
  generateSummary,
  explainConcept,
  askDocumentQuestion,
} from "../services/geminiService.js";

// Helper: Safely resolve User ID
const getUserId = (req) => req.user?._id || req.user?.id;

// POST /api/ai/chat
export const chatWithDoc = async (req, res) => {
  try {
    const { documentId, question } = req.body;
    const userId = getUserId(req);

    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    const doc = await Document.findOne({ _id: documentId, userId });
    if (!doc || !doc.extractedText) {
      return res.status(404).json({ message: "Document text not found" });
    }

    const answer = await askDocumentQuestion(doc.extractedText, question);
    res.status(200).json({ answer });
  } catch (error) {
    res.status(500).json({ message: error.message || "Chat failed" });
  }
};

// POST /api/ai/summary
export const summarizeDoc = async (req, res) => {
  try {
    const { documentId } = req.body;
    const userId = getUserId(req);

    const doc = await Document.findOne({ _id: documentId, userId });
    if (!doc || !doc.extractedText) {
      return res.status(404).json({ message: "Document text not found" });
    }

    const summary = await generateSummary(doc.extractedText);
    res.status(200).json({ summary });
  } catch (error) {
    res.status(500).json({ message: error.message || "Summarization failed" });
  }
};

// POST /api/ai/explain
export const explainDocConcept = async (req, res) => {
  try {
    const { documentId, concept } = req.body;
    const userId = getUserId(req);

    if (!concept) {
      return res.status(400).json({ message: "Concept is required" });
    }

    const doc = await Document.findOne({ _id: documentId, userId });
    if (!doc || !doc.extractedText) {
      return res.status(404).json({ message: "Document text not found" });
    }

    const explanation = await explainConcept(doc.extractedText, concept);
    res.status(200).json({ concept, explanation });
  } catch (error) {
    res.status(500).json({ message: error.message || "Concept explanation failed" });
  }
};
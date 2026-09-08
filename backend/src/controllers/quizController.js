// import Quiz from "../models/Quiz.js";
// import Document from "../models/Document.js";
// import { generateQuiz } from "../services/geminiService.js";

// // GET /api/quizzes - Get all quizzes for the logged-in user
// export const getAllQuizzes = async (req, res) => {
//   try {
//     const quizzes = await Quiz.find({ userId: req.user._id })
//       .populate("documentId", "title fileName")
//       .sort({ createdAt: -1 });

//     res.status(200).json(quizzes);
//   } catch (error) {
//     res.status(500).json({ message: error.message || "Failed to fetch quizzes" });
//   }
// };

// // GET /api/quizzes/:id - Get a specific quiz by its ID
// export const getQuizById = async (req, res) => {
//   try {
//     const quiz = await Quiz.findOne({
//       _id: req.params.id,
//       userId: req.user._id,
//     }).populate("documentId", "title");

//     if (!quiz) {
//       return res.status(404).json({ message: "Quiz not found" });
//     }

//     res.status(200).json(quiz);
//   } catch (error) {
//     res.status(500).json({ message: error.message || "Failed to fetch quiz" });
//   }
// };

// // POST /api/quizzes/:id/submit - Submit answers and store the score
// export const submitQuiz = async (req, res) => {
//   try {
//     const { score } = req.body;
//     const quiz = await Quiz.findOneAndUpdate(
//       { _id: req.params.id, userId: req.user._id },
//       { score, completed: true },
//       { new: true }
//     );

//     if (!quiz) {
//       return res.status(404).json({ message: "Quiz not found" });
//     }

//     res.status(200).json(quiz);
//   } catch (error) {
//     res.status(500).json({ message: error.message || "Failed to submit quiz" });
//   }
// };

// // DELETE /api/quizzes/:id - Delete a quiz
// export const deleteQuiz = async (req, res) => {
//   try {
//     const deletedQuiz = await Quiz.findOneAndDelete({
//       _id: req.params.id,
//       userId: req.user._id,
//     });

//     if (!deletedQuiz) {
//       return res.status(404).json({ message: "Quiz not found" });
//     }

//     res.status(200).json({ message: "Quiz deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message || "Failed to delete quiz" });
//   }
// };




import Quiz from "../models/Quiz.js";
import Document from "../models/Document.js";
import { generateQuiz } from "../services/geminiService.js";

const getUserId = (req) => req.user?._id || req.user?.id;

// GET /api/quizzes/document/:documentId - Get all quizzes belonging to one document
export const getQuizzesByDocument = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { documentId } = req.params;

    const quizzes = await Quiz.find({
      documentId,
      userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json(quizzes);
  } catch (error) {
    console.error("Fetch document quizzes error:", error);
    return res.status(500).json({ message: "Failed to fetch document quizzes" });
  }
};

// GET /api/quizzes/:id - Get a single quiz by ID (for Quiz Runner and Results)
export const getQuizById = async (req, res) => {
  try {
    const userId = getUserId(req);
    const quiz = await Quiz.findOne({ _id: req.params.id, userId });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    return res.status(200).json(quiz);
  } catch (error) {
    console.error("Fetch quiz by ID error:", error);
    return res.status(500).json({ message: "Error fetching quiz details" });
  }
};

// POST /api/quizzes/generate - Generates and stores a brand-new Quiz document
export const createQuiz = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { documentId, numQuestions, title } = req.body;

    if (!documentId) {
      return res.status(400).json({ message: "documentId is required" });
    }

    const document = await Document.findOne({ _id: documentId, userId });
    if (!document || !document.extractedText) {
      return res.status(400).json({ message: "No document text available for quiz generation" });
    }

    const count = parseInt(numQuestions, 10) || 5;
    const rawQuestions = await generateQuiz(document.extractedText, count);

    // Normalize question objects to match the Quiz model schema
    const questions = (Array.isArray(rawQuestions) ? rawQuestions : []).map((q) => {
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

    // Create a new independent Quiz document in MongoDB
    const newQuiz = await Quiz.create({
      userId,
      documentId: document._id,
      title: title || `${document.title} - Quiz`,
      questions,
      score: 0,
      completed: false,
    });

    return res.status(201).json(newQuiz);
  } catch (error) {
    console.error("Quiz creation error:", error);
    return res.status(500).json({ message: error.message || "Failed to generate quiz" });
  }
};

// POST /api/quizzes/:id/submit - Submit final score
export const submitQuizScore = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { score } = req.body;

    const quiz = await Quiz.findOneAndUpdate(
      { _id: req.params.id, userId },
      { score: Number(score), completed: true },
      { new: true }
    );

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    return res.status(200).json(quiz);
  } catch (error) {
    console.error("Quiz score submission error:", error);
    return res.status(500).json({ message: "Failed to submit score" });
  }
};

// DELETE /api/quizzes/:id - Delete a specific quiz
export const deleteQuiz = async (req, res) => {
  try {
    const userId = getUserId(req);
    const deletedQuiz = await Quiz.findOneAndDelete({ _id: req.params.id, userId });

    if (!deletedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    return res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Quiz delete error:", error);
    return res.status(500).json({ message: "Failed to delete quiz" });
  }
};



import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

// Target active model
const MODEL_NAME = "gemini-3.5-flash-lite";

// Safe string slicing helper to prevent crashes
const getSafeContext = (text, maxLength = 20000) => {
  if (typeof text !== "string" || !text.trim()) {
    return "No extracted document context available.";
  }
  return text.slice(0, maxLength);
};

// Helper to safely parse JSON from Gemini responses
const cleanAndParseJson = (rawText) => {
  try {
    const cleaned = rawText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse AI JSON response:", rawText);
    throw new Error("AI returned invalid JSON format.");
  }
};

// Centralized runner with 429 rate-limit handling
const generateWithModel = async (payload) => {
  const ai = getAiClient();
  try {
    return await ai.models.generateContent({
      model: MODEL_NAME,
      ...payload,
    });
  } catch (error) {
    if (error.status === 429 || error.message?.includes("429")) {
      throw new Error(
        "Rate limit reached (15 requests/min). Please wait a moment before trying again."
      );
    }
    throw error;
  }
};

// 1. Interactive Document Chat
export const askDocumentQuestion = async (documentText, question) => {
  const context = getSafeContext(documentText, 15000);

  const prompt = `
You are an intelligent, friendly AI study tutor helping a student learn from their uploaded study material.

Rules:
1. Answer the question directly and concisely based on the Document Context below.
2. If the context contains sufficient material, base your answer primarily on it.
3. If the answer is not in the context, state what is missing briefly and provide a helpful explanation based on general subject knowledge without saying "you didn't upload a document".

Document Context:
${context}

Student Question: ${question}
`;

  const res = await generateWithModel({ contents: prompt });
  return res.text;
};

// 2. AI Action: Document Summary
export const generateSummary = async (documentText) => {
  const context = getSafeContext(documentText, 20000);

  const prompt = `
Provide a structured, clear, and comprehensive summary of the following document.
Include a high-level overview, key takeaways, and core points using clean bullet points.

Document:
${context}
`;

  const res = await generateWithModel({ contents: prompt });
  return res.text;
};

// 3. AI Action: Explain Specific Concept
export const explainConcept = async (documentText, concept) => {
  const context = getSafeContext(documentText, 20000);

  const prompt = `
Explain the concept of "${concept}" in detail for a student.
Use the document context if applicable.

Break it down into:
1. Core Definition
2. How it works (step-by-step or main components)
3. Practical Example / Analogy

Document Context:
${context}
`;

  const res = await generateWithModel({ contents: prompt });
  return res.text;
};

// 4. Generate Flashcards (10 cards)
export const generateFlashcards = async (documentText) => {
  const context = getSafeContext(documentText, 20000);

  const prompt = `
Extract 10 key concepts from the text below and create flashcards.
Return ONLY a valid JSON array of objects with keys "front" and "back".

Text:
${context}
`;

  const res = await generateWithModel({
    contents: prompt,
    config: { responseMimeType: "application/json" },
  });

  return cleanAndParseJson(res.text);
};

// 5. Generate Quiz (Dynamic question count)
export const generateQuiz = async (documentText, numQuestions = 5) => {
  const context = getSafeContext(documentText, 20000);

  const prompt = `
Generate ${numQuestions} multiple-choice study questions from this text.
Return ONLY a valid JSON array of objects with:
- "question": string
- "options": array of 4 string choices
- "correctIndex": number (0 to 3)
- "explanation": string

Text:
${context}
`;

  const res = await generateWithModel({
    contents: prompt,
    config: { responseMimeType: "application/json" },
  });

  return cleanAndParseJson(res.text);
};
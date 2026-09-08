


// Dynamic Base URL: reads VITE_API_BASE_URL in production, falls back to localhost:5000 in dev
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const API_URL = `${BASE_URL}/quizzes`;

// Get all quizzes for a specific document
export const getDocumentQuizzes = async (documentId, token) => {
  const response = await fetch(`${API_URL}/document/${documentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch quizzes");
  }
  return data;
};

// Get single quiz by ID (for Quiz Runner and Result page)
export const getQuizById = async (quizId, token) => {
  const response = await fetch(`${API_URL}/${quizId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to load quiz");
  }
  return data;
};

// Generate a new quiz with optional custom question count
export const generateDocumentQuiz = async (documentId, numQuestions = 5, token) => {
  const response = await fetch(`${API_URL}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ documentId, numQuestions }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to generate quiz");
  }
  return data;
};

// Submit quiz score
export const submitQuizScore = async (quizId, score, token) => {
  const response = await fetch(`${API_URL}/${quizId}/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ score }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to submit score");
  }
  return data;
};

// Delete a quiz
export const deleteQuiz = async (quizId, token) => {
  const response = await fetch(`${API_URL}/${quizId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to delete quiz");
  }
  return data;
};
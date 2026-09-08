// Dynamic Base URL: reads VITE_API_URL or VITE_API_BASE_URL, falls back to localhost:5000 in dev
const RAW_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const BASE_URL = RAW_URL.endsWith("/api") ? RAW_URL : `${RAW_URL}/api`;
const API_URL = `${BASE_URL}/flashcards`;

// Get all flashcard sets for user (/flashcards page)
export const getAllFlashcardSets = async (token) => {
  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to load flashcard sets");
  }
  return data;
};

// Get single flashcard set by ID (for individual deck view)
export const getFlashcardSetById = async (setId, token) => {
  const response = await fetch(`${API_URL}/${setId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch flashcard set");
  }
  return data;
};

// Get all flashcard sets for a single document
export const getDocumentFlashcards = async (documentId, token) => {
  const response = await fetch(`${API_URL}/document/${documentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch document flashcards");
  }
  return data;
};

// Generate a brand new flashcard set
export const generateDocumentFlashcards = async (documentId, token) => {
  const response = await fetch(`${API_URL}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ documentId }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to generate flashcard set");
  }
  return data;
};

// Delete a flashcard set
export const deleteFlashcardSet = async (setId, token) => {
  const response = await fetch(`${API_URL}/${setId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to delete flashcard set");
  }
  return data;
};
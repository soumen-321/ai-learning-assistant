


// Dynamic Base URL: reads VITE_API_URL or VITE_API_BASE_URL, falls back to localhost:5000
const RAW_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const BASE_URL = RAW_URL.endsWith("/api") ? RAW_URL : `${RAW_URL}/api`;
const API_URL = `${BASE_URL}/documents`;


// Upload a new PDF file
export const uploadDocument = async (formData, token) => {
  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to upload document");
  }
  return data;
};

// Get list of all documents uploaded by logged-in user
export const getDocuments = async (token) => {
  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch documents");
  }
  return data;
};

// Get single document details and extracted text
export const getDocumentById = async (id, token) => {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch document");
  }
  return data;
};

// Delete a document from MongoDB and disk
export const deleteDocument = async (id, token) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to delete document");
  }
  return data;
};

// Get user dashboard stats
export const getDashboardStats = async (token) => {
  const response = await fetch(`${API_URL}/user/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch dashboard stats");
  }
  return data;
};

// Get persistent chat conversation for a document
export const getDocumentChatHistory = async (id, token) => {
  const response = await fetch(`${API_URL}/${id}/chat`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch chat history");
  }
  return data;
};

// Post question to document chat (Calls Gemini AND persists to ChatHistory in MongoDB)
export const chatWithDocument = async (id, question, token) => {
  const response = await fetch(`${API_URL}/${id}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ question }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to send chat message");
  }
  return data.answer;
};

// Document summary helper
export const generateDocumentSummary = async (id, token) => {
  const response = await fetch(`${API_URL}/${id}/summary`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to generate summary");
  }
  return data.summary;
};

// Document concept breakdown helper
export const explainConceptAction = async (id, concept, token) => {
  const response = await fetch(`${API_URL}/${id}/explain`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ concept }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to explain concept");
  }
  return data.explanation || data;
};
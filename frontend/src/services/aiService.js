








// Dynamic Base URL: reads VITE_API_URL or VITE_API_BASE_URL, falls back to localhost:5000 in dev
const RAW_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const BASE_URL = RAW_URL.endsWith("/api") ? RAW_URL : `${RAW_URL}/api`;
const API_URL = `${BASE_URL}/ai`;

// Chat with a document
export const chatWithDocument = async (documentId, question, token) => {
  const response = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ documentId, question }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to get AI answer");
  }
  return data.answer;
};

// Generate summary for a document
export const generateDocumentSummary = async (documentId, token) => {
  const response = await fetch(`${API_URL}/summary`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ documentId }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to generate summary");
  }
  return data.summary;
};

// Explain a specific concept from the document
export const explainConceptAction = async (documentId, concept, token) => {
  const response = await fetch(`${API_URL}/explain`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ documentId, concept }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to explain concept");
  }
  return data;
};
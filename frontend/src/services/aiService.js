// // // Base endpoint for document chat
// // const API_URL = "http://localhost:5000/api/documents";

// // // Send user question to Gemini and get answer based on document text
// // export const chatWithDocument = async (id, question, token) => {
// //   const response = await fetch(`${API_URL}/${id}/chat`, {
// //     method: "POST",
// //     headers: {
// //       "Content-Type": "application/json",
// //       Authorization: `Bearer ${token}`,
// //     },
// //     body: JSON.stringify({ question }),
// //   });

// //   const data = await response.json();
// //   if (!response.ok) {
// //     throw new Error(data.message || "Failed to send message");
// //   }
// //   return data.answer;
// // };









// const API_URL = "http://localhost:5000/api/ai";

// // Chat with a document
// export const chatWithDocument = async (documentId, question, token) => {
//   const response = await fetch(`${API_URL}/chat`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify({ documentId, question }),
//   });

//   const data = await response.json();
//   if (!response.ok) {
//     throw new Error(data.message || "Failed to get AI answer");
//   }
//   return data.answer;
// };

// // Generate summary for a document
// export const generateDocumentSummary = async (documentId, token) => {
//   const response = await fetch(`${API_URL}/summary`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify({ documentId }),
//   });

//   const data = await response.json();
//   if (!response.ok) {
//     throw new Error(data.message || "Failed to generate summary");
//   }
//   return data.summary;
// };

// // Explain a specific concept from the document
// export const explainConceptAction = async (documentId, concept, token) => {
//   const response = await fetch(`${API_URL}/explain`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify({ documentId, concept }),
//   });

//   const data = await response.json();
//   if (!response.ok) {
//     throw new Error(data.message || "Failed to explain concept");
//   }
//   return data;
// };
















// Dynamic Base URL: reads VITE_API_BASE_URL in production, falls back to localhost:5000 in dev
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
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
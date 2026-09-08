// // Base endpoint for user authentication
// const API_URL = "http://localhost:5000/api/auth";

// // Register a new user account
// export const registerUser = async (userData) => {
//   const response = await fetch(`${API_URL}/register`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(userData),
//   });

//   const data = await response.json();
//   if (!response.ok) {
//     throw new Error(data.message || "Registration failed");
//   }
//   return data;
// };

// // Log in an existing user and get auth token
// export const loginUser = async (userData) => {
//   const response = await fetch(`${API_URL}/login`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(userData),
//   });

//   const data = await response.json();
//   if (!response.ok) {
//     throw new Error(data.message || "Login failed");
//   }
//   return data;
// };

// // Fetch current user details with JWT token
// export const getUserProfile = async (token) => {
//   const response = await fetch(`${API_URL}/me`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   const data = await response.json();
//   if (!response.ok) {
//     throw new Error(data.message || "Failed to fetch user profile");
//   }
//   return data;
// };









// Dynamic Base URL: reads VITE_API_BASE_URL in production, falls back to localhost:5000 in dev
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const API_URL = `${BASE_URL}/auth`;

// Register a new user account
export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }
  return data;
};

// Log in an existing user and get auth token
export const loginUser = async (userData) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }
  return data;
};

// Fetch current user details with JWT token
export const getUserProfile = async (token) => {
  const response = await fetch(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch user profile");
  }
  return data;
};
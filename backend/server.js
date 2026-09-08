// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";
// import connectDB from "./src/config/db.js";
// import authRoutes from "./src/routes/authRoutes.js";
// import documentRoutes from "./src/routes/documentRoutes.js";
// import flashcardRoutes from "./src/routes/flashcardRoutes.js"; // <-- Added
// import { errorHandler } from "./src/middleware/errorHandler.js";
// import quizRoutes from "./src/routes/quizRoutes.js";
// import aiRoutes from "./src/routes/aiRoutes.js"; // <-- Added

// dotenv.config();

// // Connect to MongoDB
// connectDB();

// const app = express();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Middleware
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || "http://localhost:5173",
//     credentials: true,
//   })
// );
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Static folder for uploaded files (points to backend/uploads)
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/ai", aiRoutes); // <-- Mount AI Actions
// app.use("/api/documents", documentRoutes);
// app.use("/api/flashcards", flashcardRoutes); // <-- Mounted
// app.use("/api/quizzes", quizRoutes); // <-- Mounted

// // Health check route
// app.get("/", (req, res) => {
//   res.send("API is running...");
// });

// // Error handling middleware (must be after all routes)
// app.use(errorHandler);

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// }); 



import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import documentRoutes from "./src/routes/documentRoutes.js";
import flashcardRoutes from "./src/routes/flashcardRoutes.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import quizRoutes from "./src/routes/quizRoutes.js";
import aiRoutes from "./src/routes/aiRoutes.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Allow both localhost (for dev) and your deployed Vercel site (from .env)
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploaded files (points to backend/uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/flashcards", flashcardRoutes);
app.use("/api/quizzes", quizRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handling middleware (must be after all routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
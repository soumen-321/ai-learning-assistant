import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  front: { type: String, required: true },
  back: { type: String, required: true },
});

const flashcardSetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },
    title: {
      type: String,
      default: "Untitled Flashcard Set",
    },
    cards: [cardSchema],
  },
  { timestamps: true }
);

export default mongoose.model("FlashcardSet", flashcardSetSchema);
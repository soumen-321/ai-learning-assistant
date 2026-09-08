


import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Loader2,
  Layers,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getFlashcardSetById } from "../../services/flashcardService";

export default function FlashcardPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flipped, setFlipped] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        setLoading(true);
        const data = await getFlashcardSetById(id, user?.token);
        setDeck(data);
      } catch (err) {
        console.error("Failed to fetch deck:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id && user?.token) {
      fetchDeck();
    }
  }, [id, user]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-slate-500 text-xs font-semibold">
        <Loader2 className="w-5 h-5 animate-spin mr-2 text-[#00B884]" />
        Loading flashcard session...
      </div>
    );
  }

  const cards = deck?.cards || [];

  if (cards.length === 0) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center space-y-4 pt-20">
        <div className="w-14 h-14 rounded-2xl bg-[#EEF2FF] text-[#6366F1] border border-[#C7D2FE] flex items-center justify-center mx-auto shadow-sm">
          <Layers className="w-7 h-7" />
        </div>
        <h2 className="text-base font-extrabold text-slate-900">No cards in this deck</h2>
        <p className="text-xs text-slate-500">
          This deck does not contain any cards yet. Return to documents to generate new flashcards.
        </p>
        <Link
          to="/flashcards"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00B884] hover:text-[#009e71] transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to All Decks</span>
        </Link>
      </div>
    );
  }

  const progressPercent = Math.round(((index + 1) / cards.length) * 100);

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto flex flex-col items-center gap-6 select-none min-h-screen">
      {/* Top Header & Breadcrumbs */}
      <div className="w-full flex items-center justify-between">
        <Link
          to="/flashcards"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#00B884] transition group"
        >
          <div className="w-7 h-7 rounded-xl bg-white border border-slate-200 flex items-center justify-center group-hover:border-[#00B884]/40 shadow-xs">
            <ChevronLeft className="w-4 h-4" />
          </div>
          <span>Back to Decks</span>
        </Link>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-[#EEF2FF] text-[#6366F1] border border-[#C7D2FE]">
          <BookOpen className="w-3.5 h-3.5 text-[#6366F1]" />
          <span>{cards.length} Total Cards</span>
        </span>
      </div>

      {/* Session Title */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {deck?.title || "Study Session"}
        </h1>
        <p className="text-xs font-semibold text-slate-400">
          Card {index + 1} of {cards.length}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md bg-slate-200/70 h-2 rounded-full overflow-hidden">
        <div
          className="bg-[#00B884] h-full transition-all duration-300 rounded-full shadow-xs"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Interactive Flip Card */}
      <div
        onClick={() => setFlipped(!flipped)}
        className={`relative w-full h-88 rounded-3xl p-8 flex flex-col justify-between items-center text-center cursor-pointer shadow-[0_8px_30px_-6px_rgba(0,0,0,0.05)] border transition-all duration-200 overflow-hidden ${
          flipped
            ? "bg-gradient-to-br from-[#E6F9F2] via-[#DCF6EB] to-[#CEF2E3] border-[#BFF0DE]"
            : "bg-white border-slate-200/90 hover:border-[#00B884]/50"
        }`}
      >
        {/* Subtle Decorative Wave SVG */}
        <svg
          className="absolute -bottom-2 -right-2 w-40 h-20 opacity-20 pointer-events-none"
          viewBox="0 0 100 50"
        >
          <path
            d="M0,30 Q30,45 60,20 T100,25 L100,50 L0,50 Z"
            fill={flipped ? "#00B884" : "#6366F1"}
          />
        </svg>

        {/* State Badge */}
        <span
          className={`text-[11px] uppercase tracking-wider font-extrabold px-3.5 py-1 rounded-full border shadow-2xs z-10 ${
            flipped
              ? "text-[#059669] bg-white border-[#BFF0DE]"
              : "text-[#6366F1] bg-[#EEF2FF] border-[#C7D2FE]"
          }`}
        >
          {flipped ? "Answer" : "Question"}
        </span>

        {/* Card Text Content */}
        <div className="my-auto px-4 z-10">
          <p
            className={`text-base sm:text-lg font-bold leading-relaxed overflow-y-auto max-h-52 pr-1 ${
              flipped ? "text-slate-900" : "text-slate-800"
            }`}
          >
            {flipped ? cards[index]?.back : cards[index]?.front}
          </p>
        </div>

        {/* Flip Hint */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 z-10">
          <RotateCw className="w-3.5 h-3.5 text-[#00B884]" />
          <span>Click to flip card</span>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-6 mt-2">
        <button
          disabled={index === 0}
          onClick={() => {
            setFlipped(false);
            setIndex((i) => i - 1);
          }}
          className="w-12 h-12 bg-white border border-slate-200/90 rounded-2xl flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 disabled:opacity-30 shadow-sm transition-all cursor-pointer"
          title="Previous Card"
        >
          <ChevronLeft className="w-5 h-5 text-slate-700" />
        </button>

        <span className="text-xs font-extrabold text-slate-700 bg-white border border-slate-200/90 px-4 py-2 rounded-xl shadow-2xs">
          {index + 1} / {cards.length}
        </span>

        <button
          disabled={index === cards.length - 1}
          onClick={() => {
            setFlipped(false);
            setIndex((i) => i + 1);
          }}
          className="w-12 h-12 bg-[#00B884] hover:bg-[#009e71] text-white rounded-2xl flex items-center justify-center disabled:opacity-30 shadow-md shadow-[#00B884]/20 transition-all cursor-pointer"
          title="Next Card"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
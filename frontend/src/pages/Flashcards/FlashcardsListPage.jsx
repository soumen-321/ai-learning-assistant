// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { Layers, ArrowRight, Loader2, Trash2, FileText } from "lucide-react";
// import { useAuth } from "../../context/AuthContext";
// import { getAllFlashcardSets, deleteFlashcardSet } from "../../services/flashcardService";

// export default function FlashcardsListPage() {
//   const { user } = useAuth();
//   const [decks, setDecks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [deletingId, setDeletingId] = useState(null);

//   const fetchDecks = async () => {
//     try {
//       setLoading(true);
//       const data = await getAllFlashcardSets(user?.token);
//       setDecks(data);
//     } catch (err) {
//       console.error("Failed to load decks:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (user?.token) {
//       fetchDecks();
//     }
//   }, [user]);

//   const handleDelete = async (e, deckId) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (!window.confirm("Are you sure you want to delete this flashcard deck?")) return;

//     try {
//       setDeletingId(deckId);
//       await deleteFlashcardSet(deckId, user?.token);
//       setDecks((prev) => prev.filter((d) => d._id !== deckId));
//     } catch (err) {
//       alert(err.message || "Failed to delete deck");
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   return (
//     <div className="p-8 max-w-5xl mx-auto space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-100">Flashcard Decks</h1>
//           <p className="text-xs text-slate-400 mt-1">Review your generated study decks</p>
//         </div>
//       </div>

//       {loading ? (
//         <div className="flex justify-center py-16 text-slate-500 text-xs">
//           <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading study decks...
//         </div>
//       ) : decks.length === 0 ? (
//         <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
//           <Layers className="w-10 h-10 text-slate-600 mx-auto mb-3" />
//           <p className="text-sm font-medium text-slate-300">No flashcard decks found</p>
//           <p className="text-xs text-slate-500 mt-1">
//             Open any document from your library and click "Generate Flashcards".
//           </p>
//           <Link
//             to="/documents"
//             className="inline-block mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition"
//           >
//             Go to Documents
//           </Link>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//           {decks.map((deck) => (
//             <Link
//               key={deck._id}
//               to={`/flashcards/${deck._id}`}
//               className="bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 p-6 rounded-2xl flex flex-col justify-between gap-6 transition-all group shadow-lg"
//             >
//               <div className="space-y-3">
//                 <div className="flex items-center justify-between">
//                   <div className="p-3 w-fit bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
//                     <Layers className="w-6 h-6" />
//                   </div>
//                   <button
//                     onClick={(e) => handleDelete(e, deck._id)}
//                     disabled={deletingId === deck._id}
//                     title="Delete Deck"
//                     className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
//                   >
//                     {deletingId === deck._id ? (
//                       <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
//                     ) : (
//                       <Trash2 className="w-4 h-4" />
//                     )}
//                   </button>
//                 </div>

//                 <div>
//                   <h3 className="text-sm font-semibold text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-1">
//                     {deck.title}
//                   </h3>
//                   <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 truncate">
//                     <FileText className="w-3 h-3 shrink-0" />
//                     <span className="truncate">{deck.documentId?.title || "Linked Document"}</span>
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 text-xs">
//                 <span className="font-semibold text-emerald-400">
//                   {deck.cards?.length || 0} Flashcards
//                 </span>
//                 <span className="flex items-center gap-1 text-slate-400 group-hover:text-slate-200">
//                   Study <ArrowRight className="w-3.5 h-3.5" />
//                 </span>
//               </div>
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }





import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Layers,
  ArrowRight,
  Loader2,
  Trash2,
  FileText,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getAllFlashcardSets,
  deleteFlashcardSet,
} from "../../services/flashcardService";

export default function FlashcardsListPage() {
  const { user } = useAuth();
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchDecks = async () => {
    try {
      setLoading(true);
      const data = await getAllFlashcardSets(user?.token);
      setDecks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load decks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchDecks();
    }
  }, [user]);

  const handleDelete = async (e, deckId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this flashcard deck?"))
      return;

    try {
      setDeletingId(deckId);
      await deleteFlashcardSet(deckId, user?.token);
      setDecks((prev) => prev.filter((d) => d._id !== deckId));
    } catch (err) {
      alert(err.message || "Failed to delete deck");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-10 bg-[#F8FAFC] min-h-screen space-y-8 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-100">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF2FF] border border-[#C7D2FE] text-xs font-bold text-[#6366F1]">
            <Sparkles className="w-3.5 h-3.5 text-[#6366F1]" />
            <span>Active Spaced Recall</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Flashcard Decks
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Review key definitions and spaced-repetition cards from your notes.
          </p>
        </div>

        <Link
          to="/documents"
          className="inline-flex items-center justify-center gap-2 bg-[#00B884] hover:bg-[#009e71] active:scale-95 text-white px-6 py-3 rounded-2xl text-xs font-bold shadow-md shadow-[#00B884]/20 transition cursor-pointer self-start sm:self-auto"
        >
          <BookOpen className="w-4 h-4" />
          <span>Go to Documents</span>
        </Link>
      </div>

      {/* Content State */}
      {loading ? (
        <div className="flex justify-center py-24 text-slate-500 text-xs font-semibold">
          <Loader2 className="w-5 h-5 animate-spin mr-2 text-[#00B884]" />
          Loading study decks...
        </div>
      ) : decks.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-16 text-center shadow-sm">
          <div className="h-14 w-14 rounded-2xl bg-[#EEF2FF] text-[#6366F1] border border-[#C7D2FE] flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Layers className="w-7 h-7" />
          </div>
          <p className="text-base font-bold text-slate-900">
            No flashcard decks found
          </p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6 leading-relaxed">
            Open any document from your library and click "Generate Flashcards"
            to build your first deck.
          </p>
          <Link
            to="/documents"
            className="inline-flex items-center gap-2 bg-[#00B884] hover:bg-[#009e71] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-[#00B884]/20 transition"
          >
            <span>Select a Document</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => (
            <Link
              key={deck._id}
              to={`/flashcards/${deck._id}`}
              className="relative overflow-hidden bg-gradient-to-br from-[#EEF2FF] via-[#E6EBFF] to-[#DCE3FF] border border-[#C7D2FE] hover:border-[#6366F1]/50 p-6 rounded-3xl flex flex-col justify-between gap-6 shadow-[0_4px_20px_-4px_rgba(99,102,241,0.08)] hover:shadow-lg transition-all duration-200 group cursor-pointer"
            >
              {/* Background Organic Wave Accent */}
              <svg
                className="absolute -bottom-2 -right-2 w-36 h-20 opacity-25 pointer-events-none"
                viewBox="0 0 100 50"
              >
                <path
                  d="M0,30 Q30,45 60,20 T100,25 L100,50 L0,50 Z"
                  fill="#6366F1"
                />
              </svg>

              <div className="space-y-4 z-10">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#6366F1] text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                    <Layers className="w-6 h-6" />
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, deck._id)}
                    disabled={deletingId === deck._id}
                    title="Delete Deck"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white/80 rounded-xl transition cursor-pointer"
                  >
                    {deletingId === deck._id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-900 transition-colors line-clamp-1">
                    {deck.title || "Untitled Deck"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium truncate">
                    <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      {deck.documentId?.title || "Linked Document"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-indigo-200/60 pt-4 text-xs z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold bg-white text-indigo-700 shadow-2xs border border-indigo-100">
                  {deck.cards?.length || 0} Cards
                </span>
                <span className="inline-flex items-center gap-1 font-bold text-indigo-700 group-hover:text-indigo-950 transition-colors">
                  <span>Study</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
// import React, { useState, useEffect, useRef } from "react";
// import { useParams, Link } from "react-router-dom";
// import ReactMarkdown from "react-markdown";
// import {
//   ArrowLeft,
//   BookOpen,
//   Send,
//   Sparkles,
//   Layers,
//   HelpCircle,
//   Plus,
//   Trash2,
//   Loader2,
//   X,
//   FileText,
//   Lightbulb,
//   Clock,
//   ArrowRight,
//   Bot,
//   User,
// } from "lucide-react";
// import { useAuth } from "../../context/AuthContext";
// import {
//   getDocumentById,
//   getDocumentChatHistory,
// } from "../../services/documentService";
// import {
//   chatWithDocument,
//   generateDocumentSummary,
//   explainConceptAction,
// } from "../../services/aiService";
// import {
//   getDocumentFlashcards,
//   generateDocumentFlashcards,
//   deleteFlashcardSet,
// } from "../../services/flashcardService";
// import {
//   getDocumentQuizzes,
//   generateDocumentQuiz,
//   deleteQuiz,
// } from "../../services/quizService";

// const DEFAULT_WELCOME_MESSAGE = {
//   sender: "ai",
//   text: "Hello! Ask me any questions about this document.",
// };

// export default function DocumentDetailPage() {
//   const { id } = useParams();
//   const { user } = useAuth();

//   const [document, setDocument] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("content");

//   // Chat State
//   const [messages, setMessages] = useState([DEFAULT_WELCOME_MESSAGE]);
//   const [chatInput, setChatInput] = useState("");
//   const [chatLoading, setChatLoading] = useState(false);
//   const chatEndRef = useRef(null);

//   // AI Actions State
//   const [summaryLoading, setSummaryLoading] = useState(false);
//   const [conceptInput, setConceptInput] = useState("");
//   const [explainLoading, setExplainLoading] = useState(false);
//   const [modalContent, setModalContent] = useState(null);

//   // Flashcards State
//   const [flashcardSets, setFlashcardSets] = useState([]);
//   const [loadingFlashcards, setLoadingFlashcards] = useState(false);

//   // Quizzes State
//   const [quizzes, setQuizzes] = useState([]);
//   const [quizModalOpen, setQuizModalOpen] = useState(false);
//   const [numQuestions, setNumQuestions] = useState(5);
//   const [generatingQuiz, setGeneratingQuiz] = useState(false);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, chatLoading]);

//   // Initial Data Load
//   useEffect(() => {
//     const fetchAllData = async () => {
//       try {
//         setLoading(true);
//         const [docData, cardsData, quizzesData, chatData] =
//           await Promise.allSettled([
//             getDocumentById(id, user?.token),
//             getDocumentFlashcards(id, user?.token),
//             getDocumentQuizzes(id, user?.token),
//             getDocumentChatHistory(id, user?.token),
//           ]);

//         if (docData.status === "fulfilled" && docData.value) {
//           setDocument(docData.value);
//         }
//         if (cardsData.status === "fulfilled" && Array.isArray(cardsData.value)) {
//           setFlashcardSets(cardsData.value);
//         }
//         if (quizzesData.status === "fulfilled" && Array.isArray(quizzesData.value)) {
//           setQuizzes(quizzesData.value);
//         }

//         // Hydrate Chat History
//         if (chatData.status === "fulfilled" && chatData.value) {
//           const loadedHistory = Array.isArray(chatData.value)
//             ? chatData.value
//             : chatData.value.messages || [];

//           if (loadedHistory.length > 0) {
//             setMessages(loadedHistory);
//           } else {
//             setMessages([DEFAULT_WELCOME_MESSAGE]);
//           }
//         }
//       } catch (err) {
//         console.error("Error loading document details:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id && user?.token) {
//       fetchAllData();
//     }
//   }, [id, user?.token]);

//   // Chat Handler
//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!chatInput.trim() || chatLoading) return;

//     const userText = chatInput.trim();
//     setChatInput("");
//     setMessages((prev) => [...prev, { sender: "user", text: userText }]);
//     setChatLoading(true);

//     try {
//       const res = await chatWithDocument(id, userText, user?.token);
//       const answer = typeof res === "string" ? res : res?.answer || "No response received.";
//       setMessages((prev) => [...prev, { sender: "ai", text: answer }]);
//     } catch (err) {
//       setMessages((prev) => [
//         ...prev,
//         { sender: "ai", text: `Error: ${err.message || "Failed to get an answer."}` },
//       ]);
//     } finally {
//       setChatLoading(false);
//     }
//   };

//   // Summary Handler
//   const handleGenerateSummary = async () => {
//     try {
//       setSummaryLoading(true);
//       const summary = await generateDocumentSummary(id, user?.token);
//       setModalContent({
//         title: "Document Summary",
//         body: summary,
//       });
//     } catch (err) {
//       alert(err.message || "Failed to generate summary");
//     } finally {
//       setSummaryLoading(false);
//     }
//   };

//   // Explain Handler
//   const handleExplainConcept = async (e) => {
//     e.preventDefault();
//     if (!conceptInput.trim() || explainLoading) return;

//     try {
//       setExplainLoading(true);
//       const res = await explainConceptAction(id, conceptInput.trim(), user?.token);
//       setModalContent({
//         title: `Explanation of "${conceptInput.trim()}"`,
//         body: res.explanation || res,
//       });
//       setConceptInput("");
//     } catch (err) {
//       alert(err.message || "Failed to explain concept");
//     } finally {
//       setExplainLoading(false);
//     }
//   };

//   // Flashcards Handlers
//   const handleCreateFlashcards = async () => {
//     try {
//       setLoadingFlashcards(true);
//       const newDeck = await generateDocumentFlashcards(id, user?.token);
//       setFlashcardSets((prev) => [newDeck, ...prev]);
//     } catch (err) {
//       alert(err.message || "Failed to generate flashcards");
//     } finally {
//       setLoadingFlashcards(false);
//     }
//   };

//   const handleDeleteFlashcard = async (setId, e) => {
//     e.stopPropagation();
//     if (!window.confirm("Delete this flashcard set?")) return;
//     try {
//       await deleteFlashcardSet(setId, user?.token);
//       setFlashcardSets((prev) => prev.filter((s) => s._id !== setId));
//     } catch (err) {
//       alert(err.message || "Failed to delete set");
//     }
//   };

//   // Quiz Handlers
//   const handleCreateQuiz = async (e) => {
//     e.preventDefault();
//     try {
//       setGeneratingQuiz(true);
//       const newQuiz = await generateDocumentQuiz(id, numQuestions, user?.token);
//       setQuizzes((prev) => [newQuiz, ...prev]);
//       setQuizModalOpen(false);
//     } catch (err) {
//       alert(err.message || "Failed to generate quiz");
//     } finally {
//       setGeneratingQuiz(false);
//     }
//   };

//   const handleDeleteQuiz = async (quizId, e) => {
//     e.stopPropagation();
//     if (!window.confirm("Delete this quiz?")) return;
//     try {
//       await deleteQuiz(quizId, user?.token);
//       setQuizzes((prev) => prev.filter((q) => q._id !== quizId));
//     } catch (err) {
//       alert(err.message || "Failed to delete quiz");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-[#F8FAFC] text-xs font-semibold text-slate-500">
//         <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#00B884]" />
//         Preparing workspace...
//       </div>
//     );
//   }

//   const pdfUrl = document?.fileName
//     ? `http://localhost:5000/uploads/${encodeURIComponent(document.fileName)}`
//     : null;

//   const tabs = [
//     { id: "content", label: "Document View", icon: FileText },
//     { id: "chat", label: "AI Study Chat", icon: Sparkles },
//     { id: "actions", label: "AI Assistant", icon: Lightbulb },
//     { id: "flashcards", label: "Flashcards", icon: Layers, count: flashcardSets.length },
//     { id: "quizzes", label: "Quizzes", icon: HelpCircle, count: quizzes.length },
//   ];

//   return (
//     <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-slate-900 p-6 md:p-10 space-y-6 select-none pb-16">
//       {/* Top Header & Breadcrumb */}
//       <div className="space-y-3">
//         <Link
//           to="/documents"
//           className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#00B884] transition group"
//         >
//           <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center group-hover:border-[#00B884]/40">
//             <ArrowLeft className="h-3.5 w-3.5" />
//           </div>
//           <span>Back to Documents</span>
//         </Link>

//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//           <div className="flex items-center gap-3.5">
//             <div className="w-12 h-12 rounded-2xl bg-[#E6F9F2] text-[#00B884] border border-[#BFF0DE] flex items-center justify-center shrink-0 shadow-sm">
//               <FileText className="w-6 h-6" />
//             </div>
//             <div>
//               <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight line-clamp-1">
//                 {document?.title || "Document Workspace"}
//               </h1>
//               <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5 font-medium">
//                 <Clock className="w-3.5 h-3.5" />
//                 <span>Uploaded {new Date(document?.createdAt || Date.now()).toLocaleDateString("en-GB")}</span>
//                 <span>•</span>
//                 <span>{document?.fileSize ? (document.fileSize / (1024 * 1024)).toFixed(2) : "0.14"} MB</span>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Tabs Navigation Pill Bar */}
//       <div className="bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-sm inline-flex flex-wrap gap-1 max-w-full">
//         {tabs.map((tab) => {
//           const Icon = tab.icon;
//           const isActive = activeTab === tab.id;
//           return (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
//                 isActive
//                   ? "bg-[#00B884] text-white shadow-md shadow-[#00B884]/20"
//                   : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
//               }`}
//             >
//               <Icon className="w-4 h-4" />
//               <span>{tab.label}</span>
//               {typeof tab.count === "number" && (
//                 <span
//                   className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
//                     isActive
//                       ? "bg-white/20 text-white"
//                       : "bg-slate-100 text-slate-500"
//                   }`}
//                 >
//                   {tab.count}
//                 </span>
//               )}
//             </button>
//           );
//         })}
//       </div>

//       {/* TAB PANELS */}
//       <div className="flex-1">
//         {/* 1. Content Tab */}
//         {activeTab === "content" && (
//           <div className="bg-white border border-slate-200/80 rounded-3xl h-[750px] overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col">
//             {pdfUrl ? (
//               <iframe
//                 src={`${pdfUrl}#toolbar=0`}
//                 title={document?.title || "PDF Document"}
//                 className="w-full h-full border-none"
//               />
//             ) : (
//               <div className="p-8 text-xs sm:text-sm text-slate-700 whitespace-pre-wrap leading-relaxed overflow-y-auto">
//                 {document?.extractedText || "No readable content found for this document."}
//               </div>
//             )}
//           </div>
//         )}

//         {/* 2. Chat Tab */}
//         {activeTab === "chat" && (
//           <div className="bg-white border border-slate-200/80 rounded-3xl p-6 h-[720px] flex flex-col justify-between shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
//             <div className="flex-1 overflow-y-auto space-y-4 pr-3">
//               {messages.map((m, idx) => {
//                 const isUser = m.sender === "user";
//                 return (
//                   <div
//                     key={idx}
//                     className={`flex items-end gap-2.5 ${
//                       isUser ? "justify-end" : "justify-start"
//                     }`}
//                   >
//                     {!isUser && (
//                       <div className="w-8 h-8 rounded-xl bg-[#E6F9F2] text-[#00B884] border border-[#BFF0DE] flex items-center justify-center shrink-0 text-xs">
//                         <Bot className="w-4 h-4" />
//                       </div>
//                     )}
//                     <div
//                       className={`max-w-[78%] rounded-2xl px-4 py-3 text-xs leading-relaxed font-medium shadow-sm ${
//                         isUser
//                           ? "bg-[#00B884] text-white rounded-br-xs"
//                           : "bg-[#F8FAFC] border border-slate-200/70 text-slate-800 rounded-bl-xs"
//                       }`}
//                     >
//                       {isUser ? (
//                         m.text
//                       ) : (
//                         <div className="space-y-1.5 [&>p]:mb-1.5 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4 [&>h3]:font-bold [&>h3]:text-slate-900 [&>h3]:mt-2">
//                           <ReactMarkdown>{m.text}</ReactMarkdown>
//                         </div>
//                       )}
//                     </div>
//                     {isUser && (
//                       <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 text-xs font-bold">
//                         <User className="w-4 h-4" />
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//               {chatLoading && (
//                 <div className="flex items-center gap-2.5 justify-start">
//                   <div className="w-8 h-8 rounded-xl bg-[#E6F9F2] text-[#00B884] border border-[#BFF0DE] flex items-center justify-center shrink-0">
//                     <Bot className="w-4 h-4" />
//                   </div>
//                   <div className="bg-[#F8FAFC] border border-slate-200/70 text-slate-500 rounded-2xl rounded-bl-xs px-4 py-3 text-xs flex items-center gap-2">
//                     <Loader2 className="h-3.5 w-3.5 animate-spin text-[#00B884]" />
//                     Analyzing material with AI...
//                   </div>
//                 </div>
//               )}
//               <div ref={chatEndRef} />
//             </div>

//             <form onSubmit={handleSendMessage} className="pt-4 flex gap-3 border-t border-slate-100">
//               <input
//                 type="text"
//                 value={chatInput}
//                 onChange={(e) => setChatInput(e.target.value)}
//                 placeholder="Ask anything about this document..."
//                 className="flex-1 bg-[#F8FAFC] border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-[#00B884] focus:ring-2 focus:ring-[#00B884]/15 transition"
//               />
//               <button
//                 type="submit"
//                 disabled={chatLoading}
//                 className="bg-[#00B884] hover:bg-[#009e71] active:scale-95 disabled:opacity-50 text-white px-5 py-3 rounded-2xl text-xs font-bold transition flex items-center gap-2 shadow-md shadow-[#00B884]/20 cursor-pointer"
//               >
//                 <Send className="h-4 w-4" />
//                 <span className="hidden sm:inline">Send</span>
//               </button>
//             </form>
//           </div>
//         )}

//         {/* 3. AI Actions Tab */}
//         {activeTab === "actions" && (
//           <div className="space-y-6 max-w-4xl">
//             {/* Action 1: Summarize Card */}
//             <div className="bg-gradient-to-br from-[#E8FAF3] to-[#DDF7EC] border border-[#BFF0DE] rounded-3xl p-7 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
//               <div className="space-y-2">
//                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#BFF0DE] text-xs font-bold text-[#00B884]">
//                   <Sparkles className="w-3.5 h-3.5" />
//                   <span>Executive AI Summary</span>
//                 </div>
//                 <h3 className="text-lg font-extrabold text-slate-900">Comprehensive Document Summary</h3>
//                 <p className="text-xs text-slate-600 max-w-lg leading-relaxed">
//                   Synthesize core insights, key theorems, formulas, and structural conclusions from this file into a single structured study brief.
//                 </p>
//               </div>

//               <button
//                 onClick={handleGenerateSummary}
//                 disabled={summaryLoading}
//                 className="bg-[#00B884] hover:bg-[#009e71] active:scale-95 disabled:opacity-50 text-white px-6 py-3.5 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-[#00B884]/25 shrink-0 cursor-pointer"
//               >
//                 {summaryLoading ? (
//                   <Loader2 className="h-4 w-4 animate-spin" />
//                 ) : (
//                   <BookOpen className="h-4 w-4" />
//                 )}
//                 <span>Generate Summary</span>
//               </button>
//             </div>

//             {/* Action 2: Explain Concept */}
//             <div className="bg-gradient-to-br from-[#FFF7ED] to-[#FFEDD5] border border-[#FED7AA] rounded-3xl p-7 shadow-sm space-y-4">
//               <div className="space-y-1.5">
//                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#FED7AA] text-xs font-bold text-amber-700">
//                   <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
//                   <span>Targeted Breakdown</span>
//                 </div>
//                 <h3 className="text-lg font-extrabold text-slate-900">Explain a Complex Concept</h3>
//                 <p className="text-xs text-slate-600 max-w-lg leading-relaxed">
//                   Stuck on a tricky definition or algorithm? Enter the topic name below to extract an intuitive explanation grounded in your notes.
//                 </p>
//               </div>

//               <form onSubmit={handleExplainConcept} className="flex flex-col sm:flex-row gap-3 pt-2">
//                 <input
//                   type="text"
//                   value={conceptInput}
//                   onChange={(e) => setConceptInput(e.target.value)}
//                   placeholder="e.g. 'Diffie-Hellman Key Exchange' or 'Buffer Overflow'"
//                   className="flex-1 bg-white border border-[#FED7AA] rounded-2xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 transition"
//                 />
//                 <button
//                   type="submit"
//                   disabled={explainLoading}
//                   className="bg-[#F59E0B] hover:bg-[#D97706] active:scale-95 disabled:opacity-50 text-white px-6 py-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-[#F59E0B]/25 shrink-0 cursor-pointer"
//                 >
//                   {explainLoading ? (
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                   ) : (
//                     <Sparkles className="h-4 w-4" />
//                   )}
//                   <span>Explain Concept</span>
//                 </button>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* 4. Flashcards Tab */}
//         {activeTab === "flashcards" && (
//           <div className="space-y-6">
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//               <div>
//                 <h3 className="text-lg font-extrabold text-slate-900">Flashcard Decks</h3>
//                 <p className="text-xs text-slate-500 font-medium">
//                   {flashcardSets.length} deck{flashcardSets.length !== 1 ? "s" : ""} generated for active recall
//                 </p>
//               </div>
//               <button
//                 onClick={handleCreateFlashcards}
//                 disabled={loadingFlashcards}
//                 className="bg-[#00B884] hover:bg-[#009e71] active:scale-95 disabled:opacity-50 text-white px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md shadow-[#00B884]/20 transition cursor-pointer self-start sm:self-auto"
//               >
//                 {loadingFlashcards ? (
//                   <Loader2 className="h-4 w-4 animate-spin" />
//                 ) : (
//                   <Plus className="h-4 w-4" />
//                 )}
//                 <span>Generate New Deck</span>
//               </button>
//             </div>

//             {flashcardSets.length === 0 ? (
//               <div className="border border-dashed border-slate-200 bg-white rounded-3xl p-12 text-center space-y-2 shadow-sm">
//                 <Layers className="w-10 h-10 text-slate-300 mx-auto" />
//                 <p className="text-sm font-bold text-slate-800">No flashcards generated yet</p>
//                 <p className="text-xs text-slate-400 max-w-sm mx-auto">
//                   Click the button above to synthesize high-yield flashcards directly from your document.
//                 </p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//                 {flashcardSets.map((deck) => (
//                   <div
//                     key={deck._id}
//                     className="relative overflow-hidden bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF] border border-[#C7D2FE] rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition group"
//                   >
//                     <svg className="absolute -bottom-2 -right-2 w-36 h-20 opacity-25 pointer-events-none" viewBox="0 0 100 50">
//                       <path d="M0,30 Q30,45 60,20 T100,25 L100,50 L0,50 Z" fill="#6366F1" />
//                     </svg>

//                     <div>
//                       <div className="flex items-start justify-between">
//                         <div className="w-12 h-12 rounded-2xl bg-[#6366F1] text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
//                           <Layers className="h-6 w-6" />
//                         </div>
//                         <button
//                           onClick={(e) => handleDeleteFlashcard(deck._id, e)}
//                           className="text-slate-400 hover:text-rose-600 p-1.5 rounded-xl hover:bg-white/60 transition cursor-pointer"
//                           title="Delete Deck"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </button>
//                       </div>

//                       <div className="mt-4 space-y-1">
//                         <h4 className="text-base font-extrabold text-slate-900 line-clamp-1">
//                           {deck.title || "Study Flashcards"}
//                         </h4>
//                         <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
//                           Created {new Date(deck.createdAt).toLocaleDateString("en-GB")}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="mt-6 pt-4 border-t border-indigo-200/60 flex items-center justify-between z-10">
//                       <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-white text-indigo-700 shadow-sm border border-indigo-100">
//                         <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
//                         <span>{deck.cards?.length || 0} Cards</span>
//                       </span>

//                       <Link
//                         to={`/flashcards/${deck._id}`}
//                         className="text-xs font-bold text-indigo-700 hover:text-indigo-900 inline-flex items-center gap-1 transition"
//                       >
//                         <span>Study Deck</span>
//                         <ArrowRight className="h-3.5 w-3.5" />
//                       </Link>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* 5. Quizzes Tab */}
//         {activeTab === "quizzes" && (
//           <div className="space-y-6">
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//               <div>
//                 <h3 className="text-lg font-extrabold text-slate-900">Document Quizzes</h3>
//                 <p className="text-xs text-slate-500 font-medium">
//                   {quizzes.length} quiz{quizzes.length !== 1 ? "zes" : ""} generated for self-assessment
//                 </p>
//               </div>
//               <button
//                 onClick={() => setQuizModalOpen(true)}
//                 className="bg-[#00B884] hover:bg-[#009e71] active:scale-95 text-white px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md shadow-[#00B884]/20 transition cursor-pointer self-start sm:self-auto"
//               >
//                 <Plus className="h-4 w-4" />
//                 <span>Create Practice Quiz</span>
//               </button>
//             </div>

//             {quizzes.length === 0 ? (
//               <div className="border border-dashed border-slate-200 bg-white rounded-3xl p-12 text-center space-y-2 shadow-sm">
//                 <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
//                 <p className="text-sm font-bold text-slate-800">No quizzes generated yet</p>
//                 <p className="text-xs text-slate-400 max-w-sm mx-auto">
//                   Click the button above to build an automated multiple-choice assessment.
//                 </p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//                 {quizzes.map((quiz) => (
//                   <div
//                     key={quiz._id}
//                     className="relative overflow-hidden bg-gradient-to-br from-[#FFF7ED] to-[#FFEDD5] border border-[#FED7AA] rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition space-y-4"
//                   >
//                     <svg className="absolute -bottom-2 -right-2 w-36 h-20 opacity-25 pointer-events-none" viewBox="0 0 100 50">
//                       <path d="M0,25 Q35,5 70,30 T100,15 L100,50 L0,50 Z" fill="#F59E0B" />
//                     </svg>

//                     <div>
//                       <div className="flex items-center justify-between">
//                         <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-white text-emerald-700 border border-emerald-200 shadow-sm">
//                           <Sparkles className="h-3.5 w-3.5 text-[#00B884]" />
//                           <span>Score: {quiz.score ?? 0}%</span>
//                         </span>
//                         <button
//                           onClick={(e) => handleDeleteQuiz(quiz._id, e)}
//                           className="text-slate-400 hover:text-rose-600 p-1.5 rounded-xl hover:bg-white/60 transition cursor-pointer"
//                           title="Delete Quiz"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </button>
//                       </div>

//                       <div className="mt-4 space-y-1">
//                         <h4 className="text-base font-extrabold text-slate-900 line-clamp-1">
//                           {quiz.title || "Document Assessment"}
//                         </h4>
//                         <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
//                           Created {new Date(quiz.createdAt).toLocaleDateString("en-GB")}
//                         </p>
//                       </div>

//                       <p className="text-xs text-slate-600 font-bold mt-2">
//                         {quiz.questions?.length || 5} Questions
//                       </p>
//                     </div>

//                     <div className="pt-3 border-t border-amber-200/60 flex gap-2 z-10">
//                       <Link
//                         to={`/quizzes/${quiz._id}`}
//                         className="flex-1 text-center bg-white hover:bg-slate-50 text-slate-800 py-2.5 rounded-xl text-xs font-bold shadow-sm transition"
//                       >
//                         Take Quiz
//                       </Link>
//                       <Link
//                         to={`/quizzes/${quiz._id}/results`}
//                         className="flex-1 text-center bg-[#00B884] hover:bg-[#009e71] text-white py-2.5 rounded-xl text-xs font-bold shadow-sm transition"
//                       >
//                         Results
//                       </Link>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* MODAL 1: AI Actions Result Modal */}
//       {modalContent && (
//         <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-4 border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
//             <div className="flex items-center justify-between border-b border-slate-100 pb-3">
//               <div className="flex items-center gap-2">
//                 <div className="w-8 h-8 rounded-xl bg-[#E6F9F2] text-[#00B884] flex items-center justify-center">
//                   <Sparkles className="w-4 h-4" />
//                 </div>
//                 <h3 className="text-base font-extrabold text-slate-900">{modalContent.title}</h3>
//               </div>
//               <button
//                 onClick={() => setModalContent(null)}
//                 className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-50 transition cursor-pointer"
//               >
//                 <X className="h-4 w-4" />
//               </button>
//             </div>
//             <div className="max-h-[60vh] overflow-y-auto text-xs sm:text-sm leading-relaxed text-slate-600 whitespace-pre-wrap pr-2 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4 [&>p]:mb-2 [&>h3]:font-bold [&>h3]:mt-3">
//               <ReactMarkdown>{modalContent.body}</ReactMarkdown>
//             </div>
//             <div className="pt-2 flex justify-end">
//               <button
//                 onClick={() => setModalContent(null)}
//                 className="bg-[#00B884] hover:bg-[#009e71] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
//               >
//                 Done Reading
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* MODAL 2: Quiz Count Selection Modal */}
//       {quizModalOpen && (
//         <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-slate-100">
//             <div className="flex items-center justify-between border-b border-slate-100 pb-3">
//               <h3 className="text-sm font-extrabold text-slate-900">Generate New Quiz</h3>
//               <button
//                 onClick={() => setQuizModalOpen(false)}
//                 className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-50 transition cursor-pointer"
//               >
//                 <X className="h-4 w-4" />
//               </button>
//             </div>

//             <form onSubmit={handleCreateQuiz} className="space-y-4">
//               <div className="space-y-1.5">
//                 <label className="text-xs font-bold text-slate-700">Number of Questions</label>
//                 <input
//                   type="number"
//                   min="1"
//                   max="20"
//                   value={numQuestions}
//                   onChange={(e) => setNumQuestions(e.target.value)}
//                   className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00B884] focus:ring-2 focus:ring-[#00B884]/20 transition"
//                 />
//               </div>

//               <div className="flex justify-end gap-2 pt-2">
//                 <button
//                   type="button"
//                   onClick={() => setQuizModalOpen(false)}
//                   className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 rounded-xl transition cursor-pointer"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={generatingQuiz}
//                   className="bg-[#00B884] hover:bg-[#009e71] active:scale-95 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-[#00B884]/20 transition flex items-center gap-2 cursor-pointer"
//                 >
//                   {generatingQuiz && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
//                   <span>Generate</span>
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


























import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import {
  ArrowLeft,
  BookOpen,
  Send,
  Sparkles,
  Layers,
  HelpCircle,
  Plus,
  Trash2,
  Loader2,
  X,
  FileText,
  Lightbulb,
  Clock,
  ArrowRight,
  Bot,
  User,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getDocumentById,
  getDocumentChatHistory,
  chatWithDocument,
  generateDocumentSummary,
  explainConceptAction,
} from "../../services/documentService";
import {
  getDocumentFlashcards,
  generateDocumentFlashcards,
  deleteFlashcardSet,
} from "../../services/flashcardService";
import {
  getDocumentQuizzes,
  generateDocumentQuiz,
  deleteQuiz,
} from "../../services/quizService";

const DEFAULT_WELCOME_MESSAGE = {
  sender: "ai",
  text: "Hello! Ask me any questions about this document.",
};

export default function DocumentDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("content");

  // Chat State
  const [messages, setMessages] = useState([DEFAULT_WELCOME_MESSAGE]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  // AI Actions State
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [conceptInput, setConceptInput] = useState("");
  const [explainLoading, setExplainLoading] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  // Flashcards State
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loadingFlashcards, setLoadingFlashcards] = useState(false);

  // Quizzes State
  const [quizzes, setQuizzes] = useState([]);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [numQuestions, setNumQuestions] = useState(5);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatLoading]);

  // Initial Data Load
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [docData, cardsData, quizzesData, chatData] =
          await Promise.allSettled([
            getDocumentById(id, user?.token),
            getDocumentFlashcards(id, user?.token),
            getDocumentQuizzes(id, user?.token),
            getDocumentChatHistory(id, user?.token),
          ]);

        if (docData.status === "fulfilled" && docData.value) {
          setDocument(docData.value);
        }
        if (cardsData.status === "fulfilled" && Array.isArray(cardsData.value)) {
          setFlashcardSets(cardsData.value);
        }
        if (quizzesData.status === "fulfilled" && Array.isArray(quizzesData.value)) {
          setQuizzes(quizzesData.value);
        }

        // Hydrate Chat History
        if (chatData.status === "fulfilled" && chatData.value) {
          const rawHistory = chatData.value;
          const loadedHistory = Array.isArray(rawHistory)
            ? rawHistory
            : rawHistory.messages || [];

          if (loadedHistory.length > 0) {
            setMessages(loadedHistory);
          } else {
            setMessages([DEFAULT_WELCOME_MESSAGE]);
          }
        }
      } catch (err) {
        console.error("Error loading document details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id && user?.token) {
      fetchAllData();
    }
  }, [id, user?.token]);

  // Chat Handler
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userText = chatInput.trim();
    setChatInput("");
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setChatLoading(true);

    try {
      const res = await chatWithDocument(id, userText, user?.token);
      const answer = typeof res === "string" ? res : res?.answer || "No response received.";
      setMessages((prev) => [...prev, { sender: "ai", text: answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: `Error: ${err.message || "Failed to get an answer."}` },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Summary Handler
  const handleGenerateSummary = async () => {
    try {
      setSummaryLoading(true);
      const summary = await generateDocumentSummary(id, user?.token);
      setModalContent({
        title: "Document Summary",
        body: summary,
      });
    } catch (err) {
      alert(err.message || "Failed to generate summary");
    } finally {
      setSummaryLoading(false);
    }
  };

  // Explain Handler
  const handleExplainConcept = async (e) => {
    e.preventDefault();
    if (!conceptInput.trim() || explainLoading) return;

    try {
      setExplainLoading(true);
      const res = await explainConceptAction(id, conceptInput.trim(), user?.token);
      setModalContent({
        title: `Explanation of "${conceptInput.trim()}"`,
        body: res.explanation || res,
      });
      setConceptInput("");
    } catch (err) {
      alert(err.message || "Failed to explain concept");
    } finally {
      setExplainLoading(false);
    }
  };

  // Flashcards Handlers
  const handleCreateFlashcards = async () => {
    try {
      setLoadingFlashcards(true);
      const newDeck = await generateDocumentFlashcards(id, user?.token);
      setFlashcardSets((prev) => [newDeck, ...prev]);
    } catch (err) {
      alert(err.message || "Failed to generate flashcards");
    } finally {
      setLoadingFlashcards(false);
    }
  };

  const handleDeleteFlashcard = async (setId, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this flashcard set?")) return;
    try {
      await deleteFlashcardSet(setId, user?.token);
      setFlashcardSets((prev) => prev.filter((s) => s._id !== setId));
    } catch (err) {
      alert(err.message || "Failed to delete set");
    }
  };

  // Quiz Handlers
  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    try {
      setGeneratingQuiz(true);
      const newQuiz = await generateDocumentQuiz(id, numQuestions, user?.token);
      setQuizzes((prev) => [newQuiz, ...prev]);
      setQuizModalOpen(false);
    } catch (err) {
      alert(err.message || "Failed to generate quiz");
    } finally {
      setGeneratingQuiz(false);
    }
  };

  const handleDeleteQuiz = async (quizId, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this quiz?")) return;
    try {
      await deleteQuiz(quizId, user?.token);
      setQuizzes((prev) => prev.filter((q) => q._id !== quizId));
    } catch (err) {
      alert(err.message || "Failed to delete quiz");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAFC] text-xs font-semibold text-slate-500">
        <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#00B884]" />
        Preparing workspace...
      </div>
    );
  }

  const pdfUrl = document?.fileName
    ? `http://localhost:5000/uploads/${encodeURIComponent(document.fileName)}`
    : null;

  const tabs = [
    { id: "content", label: "Document View", icon: FileText },
    { id: "chat", label: "AI Study Chat", icon: Sparkles },
    { id: "actions", label: "AI Assistant", icon: Lightbulb },
    { id: "flashcards", label: "Flashcards", icon: Layers, count: flashcardSets.length },
    { id: "quizzes", label: "Quizzes", icon: HelpCircle, count: quizzes.length },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-slate-900 p-6 md:p-10 space-y-6 select-none pb-16">
      {/* Top Header & Breadcrumb */}
      <div className="space-y-3">
        <Link
          to="/documents"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#00B884] transition group"
        >
          <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center group-hover:border-[#00B884]/40">
            <ArrowLeft className="h-3.5 w-3.5" />
          </div>
          <span>Back to Documents</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#E6F9F2] text-[#00B884] border border-[#BFF0DE] flex items-center justify-center shrink-0 shadow-sm">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight line-clamp-1">
                {document?.title || "Document Workspace"}
              </h1>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5 font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>Uploaded {new Date(document?.createdAt || Date.now()).toLocaleDateString("en-GB")}</span>
                <span>•</span>
                <span>{document?.fileSize ? (document.fileSize / (1024 * 1024)).toFixed(2) : "0.14"} MB</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation Pill Bar */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-sm inline-flex flex-wrap gap-1 max-w-full">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-[#00B884] text-white shadow-md shadow-[#00B884]/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {typeof tab.count === "number" && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB PANELS */}
      <div className="flex-1">
        {/* 1. Content Tab */}
        {activeTab === "content" && (
          <div className="bg-white border border-slate-200/80 rounded-3xl h-[750px] overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col">
            {pdfUrl ? (
              <iframe
                src={`${pdfUrl}#toolbar=0`}
                title={document?.title || "PDF Document"}
                className="w-full h-full border-none"
              />
            ) : (
              <div className="p-8 text-xs sm:text-sm text-slate-700 whitespace-pre-wrap leading-relaxed overflow-y-auto">
                {document?.extractedText || "No readable content found for this document."}
              </div>
            )}
          </div>
        )}

        {/* 2. Chat Tab */}
        {activeTab === "chat" && (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 h-[720px] flex flex-col justify-between shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
            <div className="flex-1 overflow-y-auto space-y-4 pr-3">
              {messages.map((m, idx) => {
                const isUser = m.sender === "user";
                return (
                  <div
                    key={idx}
                    className={`flex items-end gap-2.5 ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isUser && (
                      <div className="w-8 h-8 rounded-xl bg-[#E6F9F2] text-[#00B884] border border-[#BFF0DE] flex items-center justify-center shrink-0 text-xs">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`max-w-[78%] rounded-2xl px-4 py-3 text-xs leading-relaxed font-medium shadow-sm ${
                        isUser
                          ? "bg-[#00B884] text-white rounded-br-xs"
                          : "bg-[#F8FAFC] border border-slate-200/70 text-slate-800 rounded-bl-xs"
                      }`}
                    >
                      {isUser ? (
                        m.text
                      ) : (
                        <div className="space-y-1.5 [&>p]:mb-1.5 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4 [&>h3]:font-bold [&>h3]:text-slate-900 [&>h3]:mt-2">
                          <ReactMarkdown>{m.text}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                    {isUser && (
                      <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}
              {chatLoading && (
                <div className="flex items-center gap-2.5 justify-start">
                  <div className="w-8 h-8 rounded-xl bg-[#E6F9F2] text-[#00B884] border border-[#BFF0DE] flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-[#F8FAFC] border border-slate-200/70 text-slate-500 rounded-2xl rounded-bl-xs px-4 py-3 text-xs flex items-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#00B884]" />
                    Analyzing material with AI...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="pt-4 flex gap-3 border-t border-slate-100">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask anything about this document..."
                className="flex-1 bg-[#F8FAFC] border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-[#00B884] focus:ring-2 focus:ring-[#00B884]/15 transition"
              />
              <button
                type="submit"
                disabled={chatLoading}
                className="bg-[#00B884] hover:bg-[#009e71] active:scale-95 disabled:opacity-50 text-white px-5 py-3 rounded-2xl text-xs font-bold transition flex items-center gap-2 shadow-md shadow-[#00B884]/20 cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>
        )}

        {/* 3. AI Actions Tab */}
        {activeTab === "actions" && (
          <div className="space-y-6 max-w-4xl">
            <div className="bg-gradient-to-br from-[#E8FAF3] to-[#DDF7EC] border border-[#BFF0DE] rounded-3xl p-7 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#BFF0DE] text-xs font-bold text-[#00B884]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Executive AI Summary</span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">Comprehensive Document Summary</h3>
                <p className="text-xs text-slate-600 max-w-lg leading-relaxed">
                  Synthesize core insights, key theorems, formulas, and structural conclusions from this file into a single structured study brief.
                </p>
              </div>

              <button
                onClick={handleGenerateSummary}
                disabled={summaryLoading}
                className="bg-[#00B884] hover:bg-[#009e71] active:scale-95 disabled:opacity-50 text-white px-6 py-3.5 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-[#00B884]/25 shrink-0 cursor-pointer"
              >
                {summaryLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <BookOpen className="h-4 w-4" />
                )}
                <span>Generate Summary</span>
              </button>
            </div>

            <div className="bg-gradient-to-br from-[#FFF7ED] to-[#FFEDD5] border border-[#FED7AA] rounded-3xl p-7 shadow-sm space-y-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#FED7AA] text-xs font-bold text-amber-700">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>Targeted Breakdown</span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">Explain a Complex Concept</h3>
                <p className="text-xs text-slate-600 max-w-lg leading-relaxed">
                  Stuck on a tricky definition or algorithm? Enter the topic name below to extract an intuitive explanation grounded in your notes.
                </p>
              </div>

              <form onSubmit={handleExplainConcept} className="flex flex-col sm:flex-row gap-3 pt-2">
                <input
                  type="text"
                  value={conceptInput}
                  onChange={(e) => setConceptInput(e.target.value)}
                  placeholder="e.g. 'Diffie-Hellman Key Exchange' or 'Buffer Overflow'"
                  className="flex-1 bg-white border border-[#FED7AA] rounded-2xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 transition"
                />
                <button
                  type="submit"
                  disabled={explainLoading}
                  className="bg-[#F59E0B] hover:bg-[#D97706] active:scale-95 disabled:opacity-50 text-white px-6 py-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-[#F59E0B]/25 shrink-0 cursor-pointer"
                >
                  {explainLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  <span>Explain Concept</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 4. Flashcards Tab */}
        {activeTab === "flashcards" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Flashcard Decks</h3>
                <p className="text-xs text-slate-500 font-medium">
                  {flashcardSets.length} deck{flashcardSets.length !== 1 ? "s" : ""} generated for active recall
                </p>
              </div>
              <button
                onClick={handleCreateFlashcards}
                disabled={loadingFlashcards}
                className="bg-[#00B884] hover:bg-[#009e71] active:scale-95 disabled:opacity-50 text-white px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md shadow-[#00B884]/20 transition cursor-pointer self-start sm:self-auto"
              >
                {loadingFlashcards ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                <span>Generate New Deck</span>
              </button>
            </div>

            {flashcardSets.length === 0 ? (
              <div className="border border-dashed border-slate-200 bg-white rounded-3xl p-12 text-center space-y-2 shadow-sm">
                <Layers className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-800">No flashcards generated yet</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Click the button above to synthesize high-yield flashcards directly from your document.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {flashcardSets.map((deck) => (
                  <div
                    key={deck._id}
                    className="relative overflow-hidden bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF] border border-[#C7D2FE] rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition group"
                  >
                    <svg className="absolute -bottom-2 -right-2 w-36 h-20 opacity-25 pointer-events-none" viewBox="0 0 100 50">
                      <path d="M0,30 Q30,45 60,20 T100,25 L100,50 L0,50 Z" fill="#6366F1" />
                    </svg>

                    <div>
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-[#6366F1] text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                          <Layers className="h-6 w-6" />
                        </div>
                        <button
                          onClick={(e) => handleDeleteFlashcard(deck._id, e)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 rounded-xl hover:bg-white/60 transition cursor-pointer"
                          title="Delete Deck"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-4 space-y-1">
                        <h4 className="text-base font-extrabold text-slate-900 line-clamp-1">
                          {deck.title || "Study Flashcards"}
                        </h4>
                        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                          Created {new Date(deck.createdAt).toLocaleDateString("en-GB")}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-indigo-200/60 flex items-center justify-between z-10">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-white text-indigo-700 shadow-sm border border-indigo-100">
                        <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
                        <span>{deck.cards?.length || 0} Cards</span>
                      </span>

                      <Link
                        to={`/flashcards/${deck._id}`}
                        className="text-xs font-bold text-indigo-700 hover:text-indigo-900 inline-flex items-center gap-1 transition"
                      >
                        <span>Study Deck</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. Quizzes Tab */}
        {activeTab === "quizzes" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Document Quizzes</h3>
                <p className="text-xs text-slate-500 font-medium">
                  {quizzes.length} quiz{quizzes.length !== 1 ? "zes" : ""} generated for self-assessment
                </p>
              </div>
              <button
                onClick={() => setQuizModalOpen(true)}
                className="bg-[#00B884] hover:bg-[#009e71] active:scale-95 text-white px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md shadow-[#00B884]/20 transition cursor-pointer self-start sm:self-auto"
              >
                <Plus className="h-4 w-4" />
                <span>Create Practice Quiz</span>
              </button>
            </div>

            {quizzes.length === 0 ? (
              <div className="border border-dashed border-slate-200 bg-white rounded-3xl p-12 text-center space-y-2 shadow-sm">
                <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-800">No quizzes generated yet</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Click the button above to build an automated multiple-choice assessment.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {quizzes.map((quiz) => (
                  <div
                    key={quiz._id}
                    className="relative overflow-hidden bg-gradient-to-br from-[#FFF7ED] to-[#FFEDD5] border border-[#FED7AA] rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition space-y-4"
                  >
                    <svg className="absolute -bottom-2 -right-2 w-36 h-20 opacity-25 pointer-events-none" viewBox="0 0 100 50">
                      <path d="M0,25 Q35,5 70,30 T100,15 L100,50 L0,50 Z" fill="#F59E0B" />
                    </svg>

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-white text-emerald-700 border border-emerald-200 shadow-sm">
                          <Sparkles className="h-3.5 w-3.5 text-[#00B884]" />
                          <span>Score: {quiz.score ?? 0}%</span>
                        </span>
                        <button
                          onClick={(e) => handleDeleteQuiz(quiz._id, e)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 rounded-xl hover:bg-white/60 transition cursor-pointer"
                          title="Delete Quiz"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-4 space-y-1">
                        <h4 className="text-base font-extrabold text-slate-900 line-clamp-1">
                          {quiz.title || "Document Assessment"}
                        </h4>
                        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                          Created {new Date(quiz.createdAt).toLocaleDateString("en-GB")}
                        </p>
                      </div>

                      <p className="text-xs text-slate-600 font-bold mt-2">
                        {quiz.questions?.length || 5} Questions
                      </p>
                    </div>

                    <div className="pt-3 border-t border-amber-200/60 flex gap-2 z-10">
                      <Link
                        to={`/quizzes/${quiz._id}`}
                        className="flex-1 text-center bg-white hover:bg-slate-50 text-slate-800 py-2.5 rounded-xl text-xs font-bold shadow-sm transition"
                      >
                        Take Quiz
                      </Link>
                      <Link
                        to={`/quizzes/${quiz._id}/results`}
                        className="flex-1 text-center bg-[#00B884] hover:bg-[#009e71] text-white py-2.5 rounded-xl text-xs font-bold shadow-sm transition"
                      >
                        Results
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL 1: AI Actions Result Modal */}
      {modalContent && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-4 border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#E6F9F2] text-[#00B884] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">{modalContent.title}</h3>
              </div>
              <button
                onClick={() => setModalContent(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-50 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto text-xs sm:text-sm leading-relaxed text-slate-600 whitespace-pre-wrap pr-2 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4 [&>p]:mb-2 [&>h3]:font-bold [&>h3]:mt-3">
              <ReactMarkdown>{modalContent.body}</ReactMarkdown>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setModalContent(null)}
                className="bg-[#00B884] hover:bg-[#009e71] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Quiz Count Selection Modal */}
      {quizModalOpen && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900">Generate New Quiz</h3>
              <button
                onClick={() => setQuizModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-50 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateQuiz} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Number of Questions</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00B884] focus:ring-2 focus:ring-[#00B884]/20 transition"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setQuizModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={generatingQuiz}
                  className="bg-[#00B884] hover:bg-[#009e71] active:scale-95 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-[#00B884]/20 transition flex items-center gap-2 cursor-pointer"
                >
                  {generatingQuiz && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>Generate</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

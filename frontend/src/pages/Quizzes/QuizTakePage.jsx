// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { CheckCircle2, XCircle, Loader2, ChevronLeft } from "lucide-react";
// import { useAuth } from "../../context/AuthContext";
// import { getQuizById, submitQuizScore } from "../../services/quizService";

// export default function QuizTakePage() {
//   // Matches <Route path="/quizzes/:quizId" /> from App.jsx
//   const { quizId } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const [quiz, setQuiz] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [selected, setSelected] = useState(null);
//   const [score, setScore] = useState(0);
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     const fetchQuiz = async () => {
//       try {
//         setLoading(true);
//         const data = await getQuizById(quizId, user?.token);
//         setQuiz(data);
//       } catch (err) {
//         console.error("Failed to load quiz:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (quizId && user?.token) {
//       fetchQuiz();
//     }
//   }, [quizId, user]);

//   if (loading) {
//     return (
//       <div className="min-h-[60vh] flex items-center justify-center text-slate-500 text-xs">
//         <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading quiz questions...
//       </div>
//     );
//   }

//   const questions = quiz?.questions || [];
//   const currentQ = questions[currentIndex];

//   if (!currentQ) {
//     return (
//       <div className="p-8 max-w-xl mx-auto text-center space-y-4">
//         <p className="text-sm text-slate-300">No questions found in this quiz.</p>
//         <Link to="/dashboard" className="text-xs text-indigo-400 underline">
//           Back to Dashboard
//         </Link>
//       </div>
//     );
//   }

//   const handleSelect = (idx) => {
//     if (selected !== null) return;
//     setSelected(idx);
//     if (idx === currentQ.correctIndex) {
//       setScore((s) => s + 1);
//     }
//   };

//   const handleNext = async () => {
//     if (currentIndex < questions.length - 1) {
//       setCurrentIndex((i) => i + 1);
//       setSelected(null);
//     } else {
//       try {
//         setSubmitting(true);
//         // Persist final score to MongoDB
//         await submitQuizScore(quizId, score, user?.token);
//         navigate(`/quizzes/${quizId}/results`, {
//           state: { score, total: questions.length },
//         });
//       } catch (err) {
//         alert(err.message || "Failed to submit quiz score");
//       } finally {
//         setSubmitting(false);
//       }
//     }
//   };

//   return (
//     <div className="p-8 max-w-xl mx-auto space-y-6">
//       <Link
//         to="/dashboard"
//         className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200"
//       >
//         <ChevronLeft className="w-4 h-4" /> Back to Dashboard
//       </Link>

//       <div className="flex items-center justify-between">
//         <div className="space-y-1">
//           <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
//             Interactive Quiz Session
//           </span>
//           <h1 className="text-xl font-bold text-slate-100 line-clamp-1">
//             {quiz?.title || "Quiz Evaluation"}
//           </h1>
//         </div>
//         <span className="text-xs font-semibold text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
//           {currentIndex + 1} / {questions.length}
//         </span>
//       </div>

//       <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
//         <p className="text-sm font-semibold text-slate-100">{currentQ.question}</p>

//         <div className="space-y-2.5">
//           {currentQ.options.map((opt, idx) => {
//             let style = "border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700";

//             if (selected !== null) {
//               if (idx === currentQ.correctIndex) {
//                 style = "border-emerald-500 bg-emerald-500/10 text-emerald-300";
//               } else if (selected === idx) {
//                 style = "border-rose-500 bg-rose-500/10 text-rose-300";
//               }
//             }

//             return (
//               <button
//                 key={idx}
//                 disabled={selected !== null}
//                 onClick={() => handleSelect(idx)}
//                 className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${style}`}
//               >
//                 <span>{opt}</span>
//                 {selected !== null && idx === currentQ.correctIndex && (
//                   <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
//                 )}
//                 {selected === idx && idx !== currentQ.correctIndex && (
//                   <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
//                 )}
//               </button>
//             );
//           })}
//         </div>

//         {selected !== null && currentQ.explanation && (
//           <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300">
//             <span className="font-semibold text-indigo-400">Explanation: </span>
//             {currentQ.explanation}
//           </div>
//         )}
//       </div>

//       {selected !== null && (
//         <button
//           onClick={handleNext}
//           disabled={submitting}
//           className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl text-xs font-semibold text-white transition-colors flex items-center justify-center gap-2"
//         >
//           {submitting ? (
//             <>
//               <Loader2 className="w-4 h-4 animate-spin" />
//               Submitting results...
//             </>
//           ) : currentIndex < questions.length - 1 ? (
//             "Next Question"
//           ) : (
//             "View Quiz Results"
//           )}
//         </button>
//       )}
//     </div>
//   );
// }









import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronLeft,
  Sparkles,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getQuizById, submitQuizScore } from "../../services/quizService";

export default function QuizTakePage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const data = await getQuizById(quizId, user?.token);
        setQuiz(data);
      } catch (err) {
        console.error("Failed to load quiz:", err);
      } finally {
        setLoading(false);
      }
    };

    if (quizId && user?.token) {
      fetchQuiz();
    }
  }, [quizId, user]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-slate-500 text-xs font-semibold select-none">
        <Loader2 className="w-5 h-5 animate-spin mr-2 text-[#00B884]" /> Loading quiz questions...
      </div>
    );
  }

  const questions = quiz?.questions || [];
  const currentQ = questions[currentIndex];

  if (!currentQ) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center space-y-4 pt-20 select-none">
        <div className="w-14 h-14 rounded-2xl bg-[#FFF7ED] text-[#F59E0B] border border-[#FED7AA] flex items-center justify-center mx-auto shadow-sm">
          <HelpCircle className="w-7 h-7" />
        </div>
        <h2 className="text-base font-extrabold text-slate-900">No questions found in this quiz</h2>
        <p className="text-xs text-slate-500">
          This quiz doesn't seem to contain any questions. Return to your dashboard to review other materials.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00B884] hover:text-[#009e71] transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  const handleSelect = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === currentQ.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
    } else {
      try {
        setSubmitting(true);
        await submitQuizScore(quizId, score, user?.token);
        navigate(`/quizzes/${quizId}/results`, {
          state: { score, total: questions.length },
        });
      } catch (err) {
        alert(err.message || "Failed to submit quiz score");
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-6 select-none min-h-screen">
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#00B884] transition group"
        >
          <div className="w-7 h-7 rounded-xl bg-white border border-slate-200 flex items-center justify-center group-hover:border-[#00B884]/40 shadow-xs">
            <ChevronLeft className="w-4 h-4" />
          </div>
          <span>Exit Assessment</span>
        </Link>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-[#E6F9F2] text-[#00B884] border border-[#BFF0DE]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Question {currentIndex + 1} of {questions.length}</span>
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200/70 h-2 rounded-full overflow-hidden">
        <div
          className="bg-[#00B884] h-full transition-all duration-300 rounded-full shadow-xs"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question Headline */}
      <div className="space-y-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#F59E0B]">
          Multiple Choice Question
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight line-clamp-1">
          {quiz?.title || "Quiz Evaluation"}
        </h1>
      </div>

      {/* Question Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)]">
        <p className="text-base font-bold text-slate-900 leading-relaxed">
          {currentQ.question}
        </p>

        {/* Options List */}
        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
            let stateStyle = "bg-white border-slate-200/90 text-slate-700 hover:border-[#00B884]/60 hover:bg-slate-50/60";

            if (selected !== null) {
              if (idx === currentQ.correctIndex) {
                stateStyle = "bg-[#E6F9F2] border-[#BFF0DE] text-[#059669] font-bold shadow-xs";
              } else if (selected === idx) {
                stateStyle = "bg-rose-50 border-rose-200 text-rose-700 font-bold shadow-xs";
              } else {
                stateStyle = "bg-slate-50/40 border-slate-200/60 text-slate-400 opacity-60";
              }
            }

            return (
              <button
                key={idx}
                disabled={selected !== null}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-semibold transition-all flex items-center justify-between gap-4 cursor-pointer ${stateStyle}`}
              >
                <span>{opt}</span>
                {selected !== null && idx === currentQ.correctIndex && (
                  <CheckCircle2 className="w-5 h-5 text-[#00B884] shrink-0" />
                )}
                {selected === idx && idx !== currentQ.correctIndex && (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Explanation Callout */}
        {selected !== null && currentQ.explanation && (
          <div className="p-4 bg-[#FFF7ED] border border-[#FED7AA] rounded-2xl text-xs sm:text-sm text-slate-700 leading-relaxed animate-in fade-in duration-200">
            <span className="font-extrabold text-[#D97706] block mb-1">Key Insight / Explanation:</span>
            {currentQ.explanation}
          </div>
        )}
      </div>

      {/* Next Question / Submit Button */}
      {selected !== null && (
        <button
          onClick={handleNext}
          disabled={submitting}
          className="w-full bg-[#00B884] hover:bg-[#009e71] active:scale-98 py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-white shadow-md shadow-[#00B884]/25 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Assessment Results...</span>
            </>
          ) : currentIndex < questions.length - 1 ? (
            <>
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>View Final Results</span>
              <Sparkles className="w-4 h-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
}


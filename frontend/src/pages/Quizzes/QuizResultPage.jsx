// import React, { useEffect, useState } from "react";
// import { useParams, useLocation, Link } from "react-router-dom";
// import { CheckCircle2, RotateCcw, LayoutDashboard, Loader2 } from "lucide-react";
// import { useAuth } from "../../context/AuthContext";
// import { getQuizById } from "../../services/quizService";

// export default function QuizResultPage() {
//   // Matches <Route path="/quizzes/:quizId/results" /> in App.jsx
//   const { quizId } = useParams();
//   const { state } = useLocation();
//   const { user } = useAuth();

//   const [quiz, setQuiz] = useState(null);
//   const [loading, setLoading] = useState(!state?.score && !state?.total);

//   useEffect(() => {
//     // If user refreshed directly on this page and state is missing, load from backend
//     if (!state?.score && quizId && user?.token) {
//       const fetchResults = async () => {
//         try {
//           setLoading(true);
//           const data = await getQuizById(quizId, user.token);
//           setQuiz(data);
//         } catch (err) {
//           console.error("Failed to load quiz results:", err);
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchResults();
//     }
//   }, [quizId, user, state]);

//   if (loading) {
//     return (
//       <div className="p-12 max-w-md mx-auto text-center text-slate-500 text-xs flex items-center justify-center">
//         <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading results...
//       </div>
//     );
//   }

//   const score = state?.score ?? quiz?.score ?? 0;
//   const total = state?.total ?? quiz?.questions?.length ?? 1;
//   const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
//   const title = quiz?.title || "Document Quiz";

//   return (
//     <div className="p-12 max-w-md mx-auto text-center space-y-6">
//       <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
//         <CheckCircle2 className="w-10 h-10" />
//       </div>

//       <div className="space-y-2">
//         <h1 className="text-2xl font-bold text-slate-100">Assessment Finished!</h1>
//         <p className="text-xs text-slate-400">
//           Great job completing the practice quiz for <span className="text-slate-300 font-semibold">{title}</span>.
//         </p>
//       </div>

//       <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
//         <p className="text-xs text-slate-400 font-medium">Final Accuracy</p>
//         <p className="text-3xl font-extrabold text-indigo-400 mt-1">{percentage}%</p>
//         <p className="text-xs text-slate-500 mt-1">
//           {score} of {total} questions correct
//         </p>
//       </div>

//       <div className="flex gap-3 justify-center">
//         <Link
//           to={`/quizzes/${quizId}`}
//           className="bg-slate-900 border border-slate-800 hover:bg-slate-800 px-4 py-2.5 rounded-xl text-xs font-medium text-slate-200 flex items-center gap-2 transition"
//         >
//           <RotateCcw className="w-3.5 h-3.5" /> Retake
//         </Link>
//         <Link
//           to="/dashboard"
//           className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 rounded-xl text-xs font-medium text-white flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition"
//         >
//           <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
//         </Link>
//       </div>
//     </div>
//   );
// }





import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import {
  CheckCircle2,
  RotateCcw,
  LayoutDashboard,
  Loader2,
  Sparkles,
  Trophy,
  Award,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getQuizById } from "../../services/quizService";

export default function QuizResultPage() {
  const { quizId } = useParams();
  const { state } = useLocation();
  const { user } = useAuth();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(!state?.score && !state?.total);

  useEffect(() => {
    if (!state?.score && quizId && user?.token) {
      const fetchResults = async () => {
        try {
          setLoading(true);
          const data = await getQuizById(quizId, user.token);
          setQuiz(data);
        } catch (err) {
          console.error("Failed to load quiz results:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchResults();
    }
  }, [quizId, user, state]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-slate-500 text-xs font-semibold select-none">
        <Loader2 className="w-5 h-5 animate-spin mr-2 text-[#00B884]" /> Loading results...
      </div>
    );
  }

  const score = state?.score ?? quiz?.score ?? 0;
  const total = state?.total ?? quiz?.questions?.length ?? 1;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const title = quiz?.title || "Document Quiz";

  const isHighScorer = percentage >= 80;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 select-none">
      <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.05)] relative overflow-hidden">
        {/* Soft Background Accent Glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-[#E6F9F2] opacity-70 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 rounded-full bg-[#FFF7ED] opacity-70 pointer-events-none" />

        {/* Celebration Trophy Icon */}
        <div className="relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-[#E6F9F2] to-[#D5F5E9] border border-[#BFF0DE] text-[#00B884] rounded-3xl flex items-center justify-center mx-auto shadow-md shadow-[#00B884]/15">
            {isHighScorer ? (
              <Trophy className="w-10 h-10 text-[#00B884]" />
            ) : (
              <Award className="w-10 h-10 text-[#00B884]" />
            )}
          </div>
        </div>

        {/* Headline */}
        <div className="space-y-1.5 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F9F2] border border-[#BFF0DE] text-[11px] font-bold text-[#00B884]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Assessment Complete</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {isHighScorer ? "Outstanding Work!" : "Quiz Finished!"}
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            You completed the assessment for <span className="text-slate-800 font-bold">"{title}"</span>.
          </p>
        </div>

        {/* Score Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#F8FAFC] to-[#EEF2F6] border border-slate-200/90 rounded-2xl p-6 space-y-2 shadow-2xs z-10">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Overall Accuracy</p>
          <p className="text-4xl font-black text-slate-900 tracking-tight">
            <span className={percentage >= 70 ? "text-[#00B884]" : "text-[#F59E0B]"}>
              {percentage}%
            </span>
          </p>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200/80 px-3 py-1 rounded-full shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00B884]" />
            <span>{score} of {total} questions correct</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center pt-2 relative z-10">
          <Link
            to={`/quizzes/${quizId}`}
            className="flex-1 bg-white border border-slate-200/90 hover:bg-slate-50 active:scale-95 text-slate-700 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake</span>
          </Link>
          <Link
            to="/dashboard"
            className="flex-1 bg-[#00B884] hover:bg-[#009e71] active:scale-95 text-white py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-[#00B884]/25 transition cursor-pointer"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
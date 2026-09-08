// import React from "react";
// import { Link } from "react-router-dom";

// export default function NotFoundPage() {
//   return (
//     <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 text-center p-4">
//       <h1 className="text-7xl font-extrabold text-indigo-500">404</h1>
//       <p className="text-slate-300 font-semibold">Page Not Found</p>
//       <p className="text-slate-500 text-xs max-w-xs">The link you accessed does not exist or has been moved.</p>
//       <Link
//         to="/"
//         className="mt-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors"
//       >
//         Return to Dashboard
//       </Link>
//     </div>
//   );
// }







import React from "react";
import { Link } from "react-router-dom";
import { Compass, ArrowLeft, Sparkles } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col items-center justify-center p-6 select-none relative overflow-hidden">
      {/* Background Soft Pastel Ambient Accents */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-[#E6F9F2] opacity-60 pointer-events-none blur-2xl" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 rounded-full bg-[#EEF2FF] opacity-60 pointer-events-none blur-2xl" />

      {/* Main Elevated Card */}
      <div className="relative z-10 w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.05)]">
        {/* Visual Icon Badge */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#E6F9F2] to-[#D5F5E9] border border-[#BFF0DE] text-[#00B884] rounded-3xl flex items-center justify-center mx-auto shadow-md shadow-[#00B884]/20">
            <Compass className="w-10 h-10 animate-spin [animation-duration:12s]" />
          </div>
          <span className="absolute -top-1.5 -right-1.5 p-1.5 bg-[#FFF7ED] text-[#F59E0B] border border-[#FED7AA] rounded-full shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* 404 & Typography */}
        <div className="space-y-2">
          <h1 className="text-6xl font-black text-slate-900 tracking-tight">
            4<span className="text-[#00B884]">0</span>4
          </h1>
          <h2 className="text-base font-extrabold text-slate-800">
            Page Not Found
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            The study material, page, or link you are looking for has been moved or doesn't exist.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 w-full bg-[#00B884] hover:bg-[#009e71] active:scale-95 text-white text-xs sm:text-sm font-bold px-6 py-3.5 rounded-2xl shadow-md shadow-[#00B884]/25 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getDocuments, getDashboardStats } from "../../services/documentService";
import {
  FileText,
  Layers,
  HelpCircle,
  UploadCloud,
  Clock,
  Loader2,
  ArrowRight,
  MoreVertical,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalDocuments: 0,
    totalFlashcardSets: 0,
    totalQuizzes: 0,
  });
  const [recentDocs, setRecentDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsData, docsData] = await Promise.all([
          getDashboardStats(user?.token),
          getDocuments(user?.token),
        ]);

        if (statsData) {
          setStats({
            totalDocuments: statsData.totalDocuments ?? 0,
            totalFlashcardSets: statsData.totalFlashcardSets ?? 0,
            totalQuizzes: statsData.totalQuizzes ?? 0,
          });
        }

        if (Array.isArray(docsData)) {
          setRecentDocs(docsData.slice(0, 3));
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchDashboardData();
    }
  }, [user]);

  const userName = user?.name || "Soumen Rakshit";

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 select-none pb-12">
      {/* Top Header Bar */}
      <header className="px-8 pt-6 pb-2 flex items-center justify-end">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#00B884] text-white font-bold flex items-center justify-center text-sm shadow-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-slate-800 leading-tight">Good to see you here!</p>
            <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
              Keep learning, keep growing.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-8 py-4 max-w-6xl mx-auto space-y-6">
        
        {/* Welcome Section with 3D Stacked Books & Plant Illustration */}
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome Back, <span className="text-[#00B884]">{userName}</span> 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Here is your active learning workspace overview.
            </p>
          </div>

          {/* Top Right Illustration */}
          <div className="hidden lg:flex items-center gap-4 select-none pr-2">
            <svg
              className="w-52 h-28 drop-shadow-sm"
              viewBox="0 0 240 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Plant Pot */}
              <ellipse cx="165" cy="88" rx="14" ry="5" fill="#E2E8F0" />
              <path d="M154 62 L176 62 L172 88 L158 88 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
              {/* Plant Leaves */}
              <path d="M165 62 C160 40 148 35 145 28 C158 32 165 48 165 62 Z" fill="#34D399" />
              <path d="M165 58 C168 35 178 30 184 20 C180 34 172 48 165 58 Z" fill="#10B981" />
              <path d="M165 52 C160 30 162 20 165 10 C170 22 170 36 165 52 Z" fill="#059669" />

              {/* Stacked Book 1 (Bottom - Teal) */}
              <rect x="25" y="80" width="115" height="18" rx="4" fill="#00B884" />
              <rect x="35" y="83" width="98" height="12" rx="2" fill="#E6F9F2" />
              <text x="45" y="93" fill="#00B884" fontSize="8" fontWeight="bold" letterSpacing="1">GROW</text>

              {/* Stacked Book 2 (Middle - Cream) */}
              <rect x="32" y="62" width="112" height="18" rx="4" fill="#FEF3C7" stroke="#FDE68A" />
              <rect x="42" y="65" width="96" height="12" rx="2" fill="#FFFFFF" />
              <text x="48" y="75" fill="#D97706" fontSize="8" fontWeight="bold" letterSpacing="1">PRACTICE</text>

              {/* Stacked Book 3 (Top - Mint) */}
              <rect x="40" y="44" width="105" height="18" rx="4" fill="#A7F3D0" />
              <rect x="50" y="47" width="90" height="12" rx="2" fill="#ECFDF5" />
              <text x="58" y="57" fill="#059669" fontSize="8" fontWeight="bold" letterSpacing="1">LEARN</text>
            </svg>

            {/* Handwritten Script Typography */}
            <div className="text-right select-none">
              <span className="font-serif italic text-emerald-800 text-lg font-bold block leading-none">
                Learn
              </span>
              <span className="font-serif italic text-emerald-700 text-lg font-bold block leading-none">
                Smarter
              </span>
              <span className="font-serif italic text-emerald-600 text-sm font-semibold block leading-tight">
                Everyday
              </span>
            </div>
          </div>
        </div>

        {/* 3 Pastel Metrics Cards with Organic Wave SVG Backgrounds */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 1. Uploaded Documents (Mint) */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#E8FAF3] via-[#D5F6E9] to-[#C7F2E2] border border-[#B3EED6] rounded-3xl p-6 shadow-sm flex items-center gap-5">
            <svg className="absolute -bottom-2 -right-2 w-36 h-20 opacity-35 pointer-events-none" viewBox="0 0 100 50">
              <path d="M0,35 Q30,10 60,30 T100,20 L100,50 L0,50 Z" fill="#00B884" />
            </svg>
            <div className="w-14 h-14 rounded-2xl bg-[#00B884] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#00B884]/20 z-10">
              <FileText className="w-7 h-7" />
            </div>
            <div className="z-10">
              <p className="text-xs font-semibold text-slate-600">Uploaded Documents</p>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
                {loading ? <Loader2 className="w-5 h-5 animate-spin text-[#00B884]" /> : stats.totalDocuments}
              </p>
            </div>
          </div>

          {/* 2. Flashcard Decks (Periwinkle / Indigo) */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#EEF2FF] via-[#E2E8FF] to-[#D5DEFF] border border-[#C5D2FE] rounded-3xl p-6 shadow-sm flex items-center gap-5">
            <svg className="absolute -bottom-2 -right-2 w-36 h-20 opacity-30 pointer-events-none" viewBox="0 0 100 50">
              <path d="M0,30 Q30,45 60,20 T100,25 L100,50 L0,50 Z" fill="#6366F1" />
            </svg>
            <div className="w-14 h-14 rounded-2xl bg-[#6366F1] text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20 z-10">
              <Layers className="w-7 h-7" />
            </div>
            <div className="z-10">
              <p className="text-xs font-semibold text-slate-600">Flashcard Decks</p>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
                {loading ? <Loader2 className="w-5 h-5 animate-spin text-indigo-500" /> : `${stats.totalFlashcardSets} Sets`}
              </p>
            </div>
          </div>

          {/* 3. Quizzes Available (Peach / Amber) */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#FFF7ED] via-[#FFEDD5] to-[#FFE4C4] border border-[#FED2A4] rounded-3xl p-6 shadow-sm flex items-center gap-5">
            <svg className="absolute -bottom-2 -right-2 w-36 h-20 opacity-30 pointer-events-none" viewBox="0 0 100 50">
              <path d="M0,25 Q35,5 70,30 T100,15 L100,50 L0,50 Z" fill="#F59E0B" />
            </svg>
            <div className="w-14 h-14 rounded-2xl bg-[#F59E0B] text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20 z-10">
              <HelpCircle className="w-7 h-7" />
            </div>
            <div className="z-10">
              <p className="text-xs font-semibold text-slate-600">Quizzes Available</p>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
                {loading ? <Loader2 className="w-5 h-5 animate-spin text-amber-500" /> : `${stats.totalQuizzes} Sets`}
              </p>
            </div>
          </div>
        </div>

        {/* Study a New Document Big Banner with Laptop, Plant & Desk Art */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#EBFBF5] via-[#E2F8EF] to-[#D5F5E9] border border-[#BFF0DE] rounded-3xl p-7 sm:p-9 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left max-w-xl z-10">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Study a New Document</h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Upload PDF lecture notes or research papers to unlock AI study tools.
            </p>
            <div className="pt-2">
              <Link
                to="/documents"
                className="inline-flex items-center gap-2 bg-[#00B884] hover:bg-[#009e71] active:scale-95 text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-2xl shadow-md shadow-[#00B884]/25 transition-all cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Go to Documents</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Detailed Laptop, Stacked Books, Coffee & Plant Art */}
          <div className="hidden sm:flex items-center justify-end relative pointer-events-none z-10 shrink-0">
            <svg className="w-80 h-36" viewBox="0 0 340 140" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Stacked Green Books under Desk */}
              <rect x="5" y="98" width="70" height="15" rx="3" fill="#00B884" />
              <rect x="10" y="101" width="60" height="9" rx="1.5" fill="#E6F9F2" />
              <rect x="8" y="83" width="67" height="15" rx="3" fill="#059669" />
              <rect x="13" y="86" width="58" height="9" rx="1.5" fill="#A7F3D0" />

              {/* Ceramic Plant Pot & Leaves */}
              <ellipse cx="102" cy="115" rx="12" ry="4" fill="#CBD5E1" />
              <path d="M92 88 L112 88 L108 115 L96 115 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
              <path d="M102 88 C98 62 85 55 80 45 C95 50 102 70 102 88 Z" fill="#34D399" />
              <path d="M102 85 C108 60 120 50 128 38 C122 55 112 72 102 85 Z" fill="#10B981" />
              <path d="M102 78 C96 52 100 40 102 28 C108 42 108 60 102 78 Z" fill="#059669" />

              {/* Laptop Body & Screen */}
              <rect x="145" y="25" width="125" height="82" rx="6" fill="#1E293B" stroke="#CBD5E1" strokeWidth="2.5" />
              <rect x="150" y="30" width="115" height="72" rx="3" fill="#FFFFFF" />
              
              {/* Text inside Laptop Screen */}
              <text x="175" y="52" fill="#059669" fontStyle="italic" fontFamily="serif" fontSize="11" fontWeight="bold">Focus</text>
              <text x="172" y="67" fill="#10B981" fontStyle="italic" fontFamily="serif" fontSize="11" fontWeight="bold">Learn</text>
              <text x="174" y="82" fill="#34D399" fontStyle="italic" fontFamily="serif" fontSize="11" fontWeight="bold">Grow</text>
              
              {/* Laptop Keyboard Base */}
              <path d="M125 110 L290 110 L278 118 L137 118 Z" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5" />
              <rect x="185" y="112" width="40" height="3" rx="1.5" fill="#94A3B8" />

              {/* Pencil Holder Cup */}
              <rect x="295" y="78" width="22" height="36" rx="4" fill="#0D9488" />
              <line x1="300" y1="80" x2="295" y2="58" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />
              <line x1="306" y1="80" x2="306" y2="54" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />
              <line x1="312" y1="80" x2="318" y2="60" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Recent Materials Section */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-emerald-100 text-[#00B884]">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Recent Materials</h3>
            </div>
            <Link
              to="/documents"
              className="text-xs sm:text-sm font-bold text-[#00B884] hover:text-[#009e71] inline-flex items-center gap-1 transition"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-8 bg-white border border-slate-200/80 rounded-2xl text-xs text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin mr-2 text-[#00B884]" /> Loading materials...
            </div>
          ) : recentDocs.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center space-y-2">
              <p className="text-sm font-bold text-slate-800">No documents uploaded yet</p>
              <p className="text-xs text-slate-500">Upload your notes to review them here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentDocs.map((doc) => (
                <div
                  key={doc._id}
                  className="bg-white border border-slate-200/90 hover:border-emerald-300 p-4 sm:p-5 rounded-2xl flex items-center justify-between shadow-[0_2px_8px_-2px_rgba(0,0,0,0.03)] transition"
                >
                  <Link to={`/documents/${doc._id}`} className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-[#E6F9F2] text-[#00B884] flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-bold text-slate-800 hover:text-[#00B884] transition truncate">
                        {doc.title}
                      </p>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(doc.createdAt).toLocaleDateString("en-GB")}</span>
                        <span>•</span>
                        <span>{doc.fileSize ? (doc.fileSize / (1024 * 1024)).toFixed(2) : "0.14"} MB</span>
                      </p>
                    </div>
                  </Link>

                  <button
                    type="button"
                    className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-50 transition"
                    aria-label="Options"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
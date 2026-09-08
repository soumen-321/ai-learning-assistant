


// import React, { useState, useEffect, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   FileText,
//   Plus,
//   Trash2,
//   Clock,
//   BookOpen,
//   Sparkles,
//   Loader2,
//   Search,
// } from "lucide-react";
// import { useAuth } from "../../context/AuthContext";
// import {
//   getDocuments,
//   uploadDocument,
//   deleteDocument,
// } from "../../services/documentService";

// // Helper: Format bytes into KB/MB
// const formatFileSize = (bytes) => {
//   if (!bytes) return "0 KB";
//   const kb = bytes / 1024;
//   if (kb < 1024) return `${kb.toFixed(1)} KB`;
//   return `${(kb / 1024).toFixed(1)} MB`;
// };

// // Helper: Format relative timestamp
// const timeAgo = (dateStr) => {
//   if (!dateStr) return "";
//   const date = new Date(dateStr);
//   const now = new Date();
//   const diffInSeconds = Math.floor((now - date) / 1000);

//   if (diffInSeconds < 60) return "Uploaded just now";
//   const diffInMinutes = Math.floor(diffInSeconds / 60);
//   if (diffInMinutes < 60)
//     return `Uploaded ${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
//   const diffInHours = Math.floor(diffInMinutes / 60);
//   if (diffInHours < 24)
//     return `Uploaded ${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
//   const diffInDays = Math.floor(diffInHours / 24);
//   if (diffInDays === 1) return "Uploaded a day ago";
//   return `Uploaded ${diffInDays} days ago`;
// };

// export default function DocumentListPage() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const fileInputRef = useRef(null);

//   const [documents, setDocuments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [uploading, setUploading] = useState(false);
//   const [deletingId, setDeletingId] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");

//   const fetchDocs = async () => {
//     try {
//       setLoading(true);
//       const data = await getDocuments(user?.token);
//       setDocuments(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("Failed to load documents:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (user?.token) {
//       fetchDocs();
//     }
//   }, [user]);

//   const handleUploadClick = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   const handleFileChange = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (file.type !== "application/pdf") {
//       alert("Please select a valid PDF file.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("title", file.name.replace(/\.[^/.]+$/, ""));

//     try {
//       setUploading(true);
//       await uploadDocument(formData, user?.token);
//       await fetchDocs();
//     } catch (err) {
//       alert(err.message || "Failed to upload document");
//     } finally {
//       setUploading(false);
//       e.target.value = "";
//     }
//   };

//   const handleDelete = async (e, docId) => {
//     e.preventDefault();
//     e.stopPropagation();

//     const confirmed = window.confirm(
//       "Are you sure you want to delete this document and all associated flashcards and quizzes?"
//     );
//     if (!confirmed) return;

//     try {
//       setDeletingId(docId);
//       await deleteDocument(docId, user?.token);
//       setDocuments((prev) => prev.filter((d) => d._id !== docId));
//     } catch (err) {
//       alert(err.message || "Failed to delete document");
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   const filteredDocs = documents.filter((doc) =>
//     doc.title?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="flex-1 p-8 bg-[#F8FAFC] min-h-screen space-y-8">
//       {/* Hidden File Picker */}
//       <input
//         type="file"
//         ref={fileInputRef}
//         onChange={handleFileChange}
//         accept="application/pdf"
//         className="hidden"
//       />

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
//           <p className="text-xs text-gray-500 mt-1">
//             Manage and organize your learning materials
//           </p>
//         </div>

//         <button
//           onClick={handleUploadClick}
//           disabled={uploading}
//           className="inline-flex items-center justify-center gap-2 bg-[#00B884] hover:bg-[#009b6f] disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition"
//         >
//           {uploading ? (
//             <>
//               <Loader2 className="w-4 h-4 animate-spin" />
//               <span>Uploading & Parsing...</span>
//             </>
//           ) : (
//             <>
//               <Plus className="w-4 h-4" />
//               <span>Upload Document</span>
//             </>
//           )}
//         </button>
//       </div>

//       {/* Search Input */}
//       <div className="relative max-w-md">
//         <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
//         <input
//           type="text"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           placeholder="Search documents by title..."
//           className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00B884] transition"
//         />
//       </div>

//       {/* Content Area */}
//       {loading ? (
//         <div className="flex justify-center py-20 text-gray-400 text-xs">
//           <Loader2 className="w-5 h-5 animate-spin mr-2 text-[#00B884]" />
//           Loading documents...
//         </div>
//       ) : filteredDocs.length === 0 ? (
//         <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-16 text-center">
//           <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-[#00B884] flex items-center justify-center mx-auto mb-3">
//             <FileText className="w-6 h-6" />
//           </div>
//           <p className="text-sm font-semibold text-gray-800">
//             {searchQuery ? "No matching documents" : "No documents yet"}
//           </p>
//           <p className="text-xs text-gray-400 mt-1 mb-4">
//             {searchQuery
//               ? "Try adjusting your search query."
//               : "Upload a PDF document to start generating summaries, quizzes, and decks."}
//           </p>
//           {!searchQuery && (
//             <button
//               onClick={handleUploadClick}
//               disabled={uploading}
//               className="inline-flex items-center gap-1.5 bg-[#00B884] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#009b6f] transition"
//             >
//               <Plus className="w-3.5 h-3.5" /> Upload your first PDF
//             </button>
//           )}
//         </div>
//       ) : (
//         /* Cards Grid */
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {filteredDocs.map((doc) => (
//             <div
//               key={doc._id}
//               onClick={() => navigate(`/documents/${doc._id}`)}
//               className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition cursor-pointer relative group"
//             >
//               {/* Top Row: Icon & Delete */}
//               <div className="flex items-start justify-between">
//                 <div className="h-11 w-11 rounded-xl bg-[#00B884] flex items-center justify-center text-white shadow-sm">
//                   <FileText className="h-6 w-6" />
//                 </div>
//                 <button
//                   type="button"
//                   title="Delete Document"
//                   disabled={deletingId === doc._id}
//                   onClick={(e) => handleDelete(e, doc._id)}
//                   className="text-gray-300 hover:text-rose-500 transition p-1 rounded-lg"
//                 >
//                   {deletingId === doc._id ? (
//                     <Loader2 className="h-4 w-4 animate-spin text-rose-500" />
//                   ) : (
//                     <Trash2 className="h-4 w-4" />
//                   )}
//                 </button>
//               </div>

//               {/* Title & File Size */}
//               <div className="mt-4 mb-4">
//                 <h3
//                   className="font-semibold text-gray-900 text-sm line-clamp-1 group-hover:text-[#00B884] transition"
//                   title={doc.title}
//                 >
//                   {doc.title}
//                 </h3>
//                 <p className="text-xs text-gray-400 mt-1 font-medium">
//                   {formatFileSize(doc.fileSize || doc.size)}
//                 </p>
//               </div>

//               {/* Badges: Flashcards & Quizzes */}
//               <div className="flex items-center gap-2 mb-4">
//                 <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#FBF0FF] text-[#A855F7] border border-[#F3E8FF]">
//                   <BookOpen className="h-3 w-3" />
//                   {doc.flashcardCount || 0} Flashcards
//                 </span>
//                 <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#ECFDF5] text-[#059669] border border-[#D1FAE5]">
//                   <Sparkles className="h-3 w-3" />
//                   {doc.quizCount || 0} Quizzes
//                 </span>
//               </div>

//               {/* Footer: Upload Timestamp */}
//               <div className="pt-3 border-t border-gray-50 flex items-center gap-1.5 text-xs text-gray-400 font-medium">
//                 <Clock className="h-3.5 w-3.5 text-gray-400" />
//                 <span>{timeAgo(doc.createdAt)}</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }






import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  Plus,
  Trash2,
  Clock,
  Layers,
  Sparkles,
  Loader2,
  Search,
  ArrowUpRight,
  UploadCloud,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getDocuments,
  uploadDocument,
  deleteDocument,
} from "../../services/documentService";

// Helper: Format bytes into KB/MB
const formatFileSize = (bytes) => {
  if (!bytes) return "0 KB";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
};

// Helper: Format relative timestamp
const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Uploaded just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60)
    return `Uploaded ${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24)
    return `Uploaded ${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "Uploaded yesterday";
  return `Uploaded ${diffInDays}d ago`;
};

export default function DocumentListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const data = await getDocuments(user?.token);
      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchDocs();
    }
  }, [user]);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please select a valid PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", file.name.replace(/\.[^/.]+$/, ""));

    try {
      setUploading(true);
      await uploadDocument(formData, user?.token);
      await fetchDocs();
    } catch (err) {
      alert(err.message || "Failed to upload document");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (e, docId) => {
    e.preventDefault();
    e.stopPropagation();

    const confirmed = window.confirm(
      "Are you sure you want to delete this document and all associated flashcards and quizzes?"
    );
    if (!confirmed) return;

    try {
      setDeletingId(docId);
      await deleteDocument(docId, user?.token);
      setDocuments((prev) => prev.filter((d) => d._id !== docId));
    } catch (err) {
      alert(err.message || "Failed to delete document");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredDocs = documents.filter((doc) =>
    doc.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 p-6 md:p-10 bg-[#F8FAFC] min-h-screen space-y-8 select-none">
      {/* Hidden File Picker */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="application/pdf"
        className="hidden"
      />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-100">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Documents
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage your study materials, lecture PDFs, and AI-generated outputs.
          </p>
        </div>

        <button
          onClick={handleUploadClick}
          disabled={uploading}
          className="inline-flex items-center justify-center gap-2 bg-[#00B884] hover:bg-[#009e71] active:scale-95 disabled:opacity-50 text-white px-6 py-3.5 rounded-2xl text-xs font-bold shadow-md shadow-[#00B884]/25 transition cursor-pointer shrink-0"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Uploading & Parsing...</span>
            </>
          ) : (
            <>
              <UploadCloud className="w-4 h-4" />
              <span>Upload Document</span>
            </>
          )}
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search documents by title..."
          className="w-full bg-white border border-slate-200/90 rounded-2xl pl-11 pr-4 py-3 text-xs text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:border-[#00B884] focus:ring-2 focus:ring-[#00B884]/15 transition"
        />
      </div>

      {/* Content State */}
      {loading ? (
        <div className="flex items-center justify-center py-28 text-slate-500 text-xs font-semibold">
          <Loader2 className="w-5 h-5 animate-spin mr-2 text-[#00B884]" />
          Loading your documents repository...
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-16 text-center shadow-sm">
          <div className="h-14 w-14 rounded-2xl bg-[#E6F9F2] text-[#00B884] border border-[#BFF0DE] flex items-center justify-center mx-auto mb-4 shadow-sm">
            <FileText className="w-7 h-7" />
          </div>
          <p className="text-base font-bold text-slate-900">
            {searchQuery ? "No matching documents found" : "No documents uploaded yet"}
          </p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6 leading-relaxed">
            {searchQuery
              ? "Check your spelling or clear the search filter."
              : "Upload your syllabus or lecture slides to unlock automatic flashcards and quizzes."}
          </p>
          {!searchQuery && (
            <button
              onClick={handleUploadClick}
              disabled={uploading}
              className="inline-flex items-center gap-2 bg-[#00B884] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#009e71] shadow-md shadow-[#00B884]/20 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Upload your first PDF
            </button>
          )}
        </div>
      ) : (
        /* Cards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredDocs.map((doc) => (
            <div
              key={doc._id}
              onClick={() => navigate(`/documents/${doc._id}`)}
              className="group bg-white rounded-3xl border border-slate-200/80 hover:border-[#00B884]/50 p-5 flex flex-col justify-between shadow-[0_2px_10px_-2px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all duration-200 cursor-pointer relative"
            >
              {/* Top Row: Icon & Delete */}
              <div className="flex items-start justify-between">
                <div className="h-12 w-12 rounded-2xl bg-[#E6F9F2] text-[#00B884] border border-[#BFF0DE] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <FileText className="h-6 w-6" />
                </div>
                <button
                  type="button"
                  title="Delete Document"
                  disabled={deletingId === doc._id}
                  onClick={(e) => handleDelete(e, doc._id)}
                  className="text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition p-2 rounded-xl cursor-pointer"
                >
                  {deletingId === doc._id ? (
                    <Loader2 className="h-4 w-4 animate-spin text-rose-500" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Title & File Size */}
              <div className="mt-5 mb-4">
                <h3
                  className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-[#00B884] transition"
                  title={doc.title}
                >
                  {doc.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  {formatFileSize(doc.fileSize || doc.size)}
                </p>
              </div>

              {/* Badges: Flashcards & Quizzes */}
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-[#EEF2FF] text-[#6366F1] border border-[#C7D2FE]">
                  <Layers className="h-3 w-3" />
                  <span>{doc.flashcardCount || 0} Decks</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#D1FAE5]">
                  <Sparkles className="h-3 w-3" />
                  <span>{doc.quizCount || 0} Quizzes</span>
                </span>
              </div>

              {/* Footer: Upload Timestamp & Action Hint */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>{timeAgo(doc.createdAt)}</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-[#00B884] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


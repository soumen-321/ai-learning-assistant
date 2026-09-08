// import React, { useState } from "react";
// import { User, Mail, Lock, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
// import { useAuth } from "../../context/AuthContext";

// export default function ProfilePage() {
//   const { user } = useAuth();

//   const [passwords, setPasswords] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: "", text: "" });

//   const handleChange = (e) => {
//     setPasswords({ ...passwords, [e.target.name]: e.target.value });
//     if (message.text) setMessage({ type: "", text: "" });
//   };

//   const handleChangePassword = async (e) => {
//     e.preventDefault();

//     if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
//       setMessage({ type: "error", text: "Please fill in all password fields." });
//       return;
//     }

//     if (passwords.newPassword !== passwords.confirmPassword) {
//       setMessage({ type: "error", text: "New passwords do not match." });
//       return;
//     }

//     if (passwords.newPassword.length < 6) {
//       setMessage({ type: "error", text: "New password must be at least 6 characters." });
//       return;
//     }

//     // Resolve token across any common storage location
//     const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
//     const token =
//       user?.token ||
//       storedUser?.token ||
//       localStorage.getItem("token");

//     if (!token) {
//       setMessage({
//         type: "error",
//         text: "Authentication token not found. Please log out and sign in again.",
//       });
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await fetch("http://localhost:5000/api/auth/change-password", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           currentPassword: passwords.currentPassword,
//           newPassword: passwords.newPassword,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || `Request failed with status ${response.status}`);
//       }

//       setMessage({ type: "success", text: "Password updated successfully!" });
//       setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
//     } catch (err) {
//       console.error("Change password failure:", err);
//       setMessage({ type: "error", text: err.message || "Failed to update password." });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex-1 min-h-screen bg-[#F8FAFC] p-8 space-y-6">
//       {/* Title */}
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
//       </div>

//       {/* Message Banner */}
//       {message.text && (
//         <div
//           className={`flex items-center gap-2.5 p-4 rounded-xl text-xs font-semibold max-w-5xl ${
//             message.type === "success"
//               ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
//               : "bg-rose-50 text-rose-700 border border-rose-200"
//           }`}
//         >
//           {message.type === "success" ? (
//             <CheckCircle2 className="h-4 w-4 shrink-0 text-[#00B884]" />
//           ) : (
//             <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
//           )}
//           <span>{message.text}</span>
//         </div>
//       )}

//       <div className="space-y-6 max-w-5xl">
//         {/* Card 1: User Information */}
//         <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
//           <h2 className="text-base font-bold text-gray-900">User Information</h2>

//           <div className="space-y-4">
//             {/* Username */}
//             <div className="space-y-1.5">
//               <label className="text-xs font-medium text-gray-700">Username</label>
//               <div className="relative">
//                 <User className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
//                 <input
//                   type="text"
//                   readOnly
//                   value={user?.username || user?.name || "User"}
//                   className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-800 focus:outline-none cursor-default select-none"
//                 />
//               </div>
//             </div>

//             {/* Email Address */}
//             <div className="space-y-1.5">
//               <label className="text-xs font-medium text-gray-700">Email Address</label>
//               <div className="relative">
//                 <Mail className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
//                 <input
//                   type="email"
//                   readOnly
//                   value={user?.email || "user@example.com"}
//                   className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-800 focus:outline-none cursor-default select-none"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Card 2: Change Password */}
//         <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm">
//           <form onSubmit={handleChangePassword} className="space-y-5">
//             <h2 className="text-base font-bold text-gray-900">Change Password</h2>

//             {/* Current Password */}
//             <div className="space-y-1.5">
//               <label className="text-xs font-medium text-gray-700">Current Password</label>
//               <div className="relative">
//                 <Lock className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
//                 <input
//                   type="password"
//                   name="currentPassword"
//                   value={passwords.currentPassword}
//                   onChange={handleChange}
//                   placeholder="Enter current password"
//                   className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#00B884] transition"
//                 />
//               </div>
//             </div>

//             {/* New Password */}
//             <div className="space-y-1.5">
//               <label className="text-xs font-medium text-gray-700">New Password</label>
//               <div className="relative">
//                 <Lock className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
//                 <input
//                   type="password"
//                   name="newPassword"
//                   value={passwords.newPassword}
//                   onChange={handleChange}
//                   placeholder="Enter new password"
//                   className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#00B884] transition"
//                 />
//               </div>
//             </div>

//             {/* Confirm New Password */}
//             <div className="space-y-1.5">
//               <label className="text-xs font-medium text-gray-700">Confirm New Password</label>
//               <div className="relative">
//                 <Lock className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
//                 <input
//                   type="password"
//                   name="confirmPassword"
//                   value={passwords.confirmPassword}
//                   onChange={handleChange}
//                   placeholder="Confirm new password"
//                   className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#00B884] transition"
//                 />
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div className="flex justify-end pt-2">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="bg-[#00B884] hover:bg-[#009b6f] disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-2 cursor-pointer"
//               >
//                 {loading && <Loader2 className="h-4 w-4 animate-spin" />}
//                 Change Password
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }




import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  KeyRound,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
    if (message.text) setMessage({ type: "", text: "" });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (
      !passwords.currentPassword ||
      !passwords.newPassword ||
      !passwords.confirmPassword
    ) {
      setMessage({
        type: "error",
        text: "Please fill in all password fields.",
      });
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    if (passwords.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "New password must be at least 6 characters.",
      });
      return;
    }

    // Resolve token across any common storage location
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const token =
      user?.token ||
      storedUser?.token ||
      localStorage.getItem("token");

    if (!token) {
      setMessage({
        type: "error",
        text: "Authentication token not found. Please log out and sign in again.",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:5000/api/auth/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: passwords.currentPassword,
            newPassword: passwords.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `Request failed with status ${response.status}`
        );
      }

      setMessage({ type: "success", text: "Password updated successfully!" });
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Change password failure:", err);
      setMessage({
        type: "error",
        text: err.message || "Failed to update password.",
      });
    } finally {
      setLoading(false);
    }
  };

  const displayName = user?.username || user?.name || "Student";
  const displayEmail = user?.email || "user@example.com";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex-1 min-h-screen bg-[#F8FAFC] text-slate-900 p-6 md:p-10 space-y-8 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-100">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F9F2] border border-[#BFF0DE] text-xs font-bold text-[#00B884]">
            <Sparkles className="w-3.5 h-3.5 text-[#00B884]" />
            <span>Account Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Profile Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage your personal credentials, workspace presence, and security.
          </p>
        </div>
      </div>

      {/* Message Banner */}
      {message.text && (
        <div
          className={`flex items-center gap-3 p-4 rounded-2xl text-xs font-bold max-w-4xl shadow-sm transition-all ${
            message.type === "success"
              ? "bg-[#E6F9F2] text-[#059669] border border-[#BFF0DE]"
              : "bg-rose-50 text-rose-700 border border-rose-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-[#00B884]" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="space-y-6 max-w-4xl">
        {/* Profile Card Header Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#EBFBF5] via-[#E2F8EF] to-[#D8F6EB] border border-[#BFF0DE] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center gap-6">
          {/* Large Avatar Badge */}
          <div className="w-20 h-20 rounded-3xl bg-[#00B884] text-white font-black text-3xl flex items-center justify-center shadow-lg shadow-[#00B884]/25 shrink-0 border-4 border-white">
            {initial}
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">
                {displayName}
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-[#00B884] border border-[#BFF0DE]">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified Account</span>
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500">{displayEmail}</p>
          </div>
        </div>

        {/* Card 1: User Information */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E6F9F2] text-[#00B884] border border-[#BFF0DE] flex items-center justify-center shadow-sm">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                User Details
              </h2>
              <p className="text-xs text-slate-500">
                System identity and associated primary mailbox.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Username</label>
              <div className="relative">
                <User className="h-4 w-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  readOnly
                  value={displayName}
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-xs font-bold text-slate-800 focus:outline-none cursor-default select-none"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="h-4 w-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  readOnly
                  value={displayEmail}
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-xs font-bold text-slate-800 focus:outline-none cursor-default select-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Change Password */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
          <form onSubmit={handleChangePassword} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EEF2FF] text-[#6366F1] border border-[#C7D2FE] flex items-center justify-center shadow-sm">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Change Password
                </h2>
                <p className="text-xs text-slate-500">
                  Keep your account secure with a strong password.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Current Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwords.currentPassword}
                    onChange={handleChange}
                    placeholder="Enter current password"
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#00B884] focus:ring-2 focus:ring-[#00B884]/15 transition"
                  />
                </div>
              </div>

              {/* New Password & Confirm Password in 2-Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="h-4 w-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      name="newPassword"
                      value={passwords.newPassword}
                      onChange={handleChange}
                      placeholder="Minimum 6 characters"
                      className="w-full bg-[#F8FAFC] border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#00B884] focus:ring-2 focus:ring-[#00B884]/15 transition"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="h-4 w-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwords.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter new password"
                      className="w-full bg-[#F8FAFC] border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#00B884] focus:ring-2 focus:ring-[#00B884]/15 transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#00B884] hover:bg-[#009e71] active:scale-95 disabled:opacity-50 text-white px-6 py-3 rounded-2xl text-xs font-bold shadow-md shadow-[#00B884]/20 transition flex items-center gap-2 cursor-pointer"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>Update Password</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
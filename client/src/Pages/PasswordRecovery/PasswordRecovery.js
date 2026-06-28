import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { errorToast, successToast, url } from "../../utils";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

const PasswordRecovery = () => {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [codeGenerated, setCodeGenerated] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [formUsed, setFormUsed] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const generateRandomCode = (length) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    const generated = generateRandomCode(6);
    setCodeGenerated(generated);
    setLoading(true);
    axios.post(`${url}/api/v1/send-email`, { email, code: generated })
      .then(() => { successToast("Code sent to your email!"); setFormUsed(1); setLoading(false); })
      .catch(() => { errorToast("Email not found"); setLoading(false); });
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    if (code === codeGenerated) { successToast("Code verified!"); setFormUsed(2); }
    else errorToast("Invalid code");
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (newPassword.length < 6) { errorToast("Password must be at least 6 characters"); return; }
    setLoading(true);
    axios.put(`${url}/api/v1/reset-password`, { email, newPassword })
      .then(() => { successToast("Password reset successfully!"); setTimeout(() => navigate("/login"), 1500); })
      .catch(() => { errorToast("Error resetting password"); setLoading(false); });
  };

  const steps = ["Enter Email", "Verify Code", "New Password"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4338ca] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
            <i className="fas fa-graduation-cap text-white text-2xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-white">LearnToCode</h1>
          <p className="text-indigo-300 mt-1 text-sm">Password Recovery</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Step indicator */}
          <div className="flex items-center gap-0 mb-7">
            {steps.map((s, i) => (
              <React.Fragment key={i}>
                <div className={`flex items-center gap-1.5 ${i <= formUsed ? "text-indigo-600" : "text-slate-300"}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i < formUsed ? "bg-emerald-100 text-emerald-600" : i === formUsed ? "bg-indigo-600 text-white" : "bg-slate-100"}`}>
                    {i < formUsed ? <i className="fas fa-check text-xs"></i> : i + 1}
                  </div>
                  <span className="text-xs font-medium hidden sm:block">{s}</span>
                </div>
                {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i < formUsed ? "bg-emerald-300" : "bg-slate-200"}`}></div>}
              </React.Fragment>
            ))}
          </div>

          {/* Step 0: Email */}
          {formUsed === 0 && (
            <>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Forgot your password?</h2>
              <p className="text-slate-500 text-sm mb-6">Enter your email and we'll send a verification code.</p>
              <form onSubmit={handleSendEmail} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                  <div className="relative">
                    <input type="email" required placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                    <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                  </div>
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
                  {loading ? <ClipLoader color="#fff" size={18} /> : <><i className="fas fa-paper-plane"></i> Send Code</>}
                </button>
              </form>
            </>
          )}

          {/* Step 1: Code */}
          {formUsed === 1 && (
            <>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Enter Verification Code</h2>
              <p className="text-slate-500 text-sm mb-6">Check your email for the 6-character code.</p>
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Verification Code</label>
                  <input type="text" required maxLength={6} placeholder="ABC123" value={code} onChange={(e) => setCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center text-xl font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all uppercase" />
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
                  <i className="fas fa-check-circle"></i> Verify Code
                </button>
              </form>
            </>
          )}

          {/* Step 2: New Password */}
          {formUsed === 2 && (
            <>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Create New Password</h2>
              <p className="text-slate-500 text-sm mb-6">Choose a strong password for your account.</p>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
                  <div className="relative">
                    <input type="password" required placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                    <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                  </div>
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
                  {loading ? <ClipLoader color="#fff" size={18} /> : <><i className="fas fa-key"></i> Reset Password</>}
                </button>
              </form>
            </>
          )}

          <p className="text-center mt-5">
            <Link to="/login" className="text-sm text-indigo-600 hover:underline font-medium"><i className="fas fa-arrow-left mr-1 text-xs"></i> Back to Login</Link>
          </p>
        </div>
        <p className="text-center text-indigo-300/60 text-xs mt-6">© {year} LearnToCode. All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default PasswordRecovery;

import React, { useState } from "react";
import HeaderI from "../../../Components/Header/HeaderI";
import { useSelector, useDispatch } from "react-redux";
import { errorToast } from "../../../utils";
import { useNavigate } from "react-router-dom";
import { update_instructor_password } from "../../../redux/actions/InstructorActions";
import { ClipLoader } from "react-spinners";
import Footer from "../../../Components/Footer/Footer";

const ChangePasswordI = () => {
  const { user } = useSelector((state) => state.LoginReducer);
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    setLoading(true);
    if (form.newPassword.length <= 5) { errorToast("Password must be at least 6 characters"); setLoading(false); return; }
    if (form.newPassword !== form.confirmPassword) { errorToast("Passwords do not match"); setLoading(false); return; }
    dispatch(update_instructor_password({ user, newPassword: form, navigate, setLoading }));
  };

  const fields = [
    { name: "currentPassword", label: "Current Password", key: "current" },
    { name: "newPassword", label: "New Password", key: "new" },
    { name: "confirmPassword", label: "Confirm New Password", key: "confirm" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      <HeaderI />
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Change Password</h1>
          <p className="text-slate-500 text-sm mt-1 dark:text-gray-400">Keep your instructor account secure</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7 dark:bg-gray-800 dark:border-gray-700">
          <div className="space-y-5 mb-6">
            {fields.map((f) => (
              <div key={f.name}>
                <label className="block text-sm font-semibold text-slate-700 mb-2 dark:text-gray-200">{f.label}</label>
                <div className="relative">
                  <input type={showPw[f.key] ? "text" : "password"} name={f.name} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-11 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:bg-gray-900 dark:border-gray-600" />
                  <i className="fas fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs dark:text-gray-500"></i>
                  <button type="button" onClick={() => setShowPw({ ...showPw, [f.key]: !showPw[f.key] })}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-gray-500 dark:hover:text-gray-300">
                    <i className={`fas ${showPw[f.key] ? "fa-eye-slash" : "fa-eye"} text-xs`}></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleSubmit}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
            {loading ? <ClipLoader color="#fff" size={18} /> : <><i className="fas fa-key"></i> Update Password</>}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ChangePasswordI;

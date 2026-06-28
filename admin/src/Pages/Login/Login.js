import React, { useEffect, useState } from "react";
import { login } from "../../redux/actions/Actions";
import { useDispatch, useSelector } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const { loading, isAuth, error } = useSelector((state) => state.LoginReducer);

  useEffect(() => {
    if (isAuth) setTimeout(() => navigate("/dashboard"), 500);
  }, [isAuth]);

  const dispatch = useDispatch();
  const [loginDetails, setLoginDetails] = useState({ email: "", password: "" });

  const handleChange = (e) => setLoginDetails({ ...loginDetails, [e.target.name]: e.target.value.trim() });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loginDetails.email.includes("@")) { toast.error("Email not valid"); return; }
    dispatch(login(loginDetails));
  };

  useEffect(() => { if (error) toast.error(error, { theme: "colored" }); }, [error]);

  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4338ca] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur rounded-2xl mb-4">
            <i className="fas fa-graduation-cap text-white text-2xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-white">LearnToCode</h1>
          <p className="text-indigo-300 mt-1 text-sm">Admin Portal</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h2>
          <p className="text-slate-500 text-sm mb-7">Sign in to your admin account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <input
                  type="email" name="email" required maxLength={64}
                  placeholder="admin@learntocode.com"
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type="password" name="password" required maxLength={64}
                  placeholder="••••••••"
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 mt-2"
            >
              {loading ? <ClipLoader color="#ffffff" size={20} /> : (
                <>
                  <i className="fas fa-sign-in-alt"></i>
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-indigo-300/60 text-xs mt-6">© {year} LearnToCode. All Rights Reserved.</p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;

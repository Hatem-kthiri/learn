import React from "react";
import { useSelector } from "react-redux";

const Footer = () => {
  const { night_mode } = useSelector((state) => state.StudentReducer);
  const year = new Date().getFullYear();
  const dm = night_mode;
  return (
    <footer className={`border-t mt-auto ${dm ? "bg-gray-900 border-gray-700" : "bg-white border-slate-100"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className={`text-sm ${dm ? "text-gray-500" : "text-slate-400"}`}>
          © {year} <span className={`font-semibold ${dm ? "text-gray-300" : "text-slate-600"}`}>LearnToCode</span>. All Rights Reserved.
        </p>
        <div className="flex items-center gap-3">
          {["fab fa-facebook-f","fab fa-twitter","fab fa-linkedin-in","fab fa-instagram","fab fa-github"].map((icon, i) => (
            <a key={i} href="#" className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-colors ${dm ? "bg-gray-800 text-gray-500 hover:bg-gray-700 hover:text-indigo-400" : "bg-slate-100 text-slate-400 hover:bg-indigo-100 hover:text-indigo-600"}`}>
              <i className={icon}></i>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

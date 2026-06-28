import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-100 bg-white mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-slate-400">© {year} <span className="font-semibold text-slate-600">LearnToCode</span>. All Rights Reserved.</p>
        <div className="flex items-center gap-3">
          {["fab fa-facebook-f","fab fa-twitter","fab fa-linkedin-in","fab fa-instagram","fab fa-github"].map((icon, i) => (
            <a key={i} href="#" className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-indigo-100 hover:text-indigo-600 flex items-center justify-center text-slate-400 transition-colors text-xs">
              <i className={icon}></i>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

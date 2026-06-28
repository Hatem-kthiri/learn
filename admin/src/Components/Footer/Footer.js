import React from "react";
import { Link } from "react-router-dom";
const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-100 bg-white px-6 py-4 mt-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-slate-400">© {year} <span className="font-semibold text-slate-600">LearnToCode</span>. All Rights Reserved.</p>
        <div className="flex items-center gap-4">
          <Link to="#" className="text-xs text-slate-400 hover:text-indigo-600 transition-colors">Terms</Link>
          <Link to="#" className="text-xs text-slate-400 hover:text-indigo-600 transition-colors">Privacy</Link>
        </div>
      </div>
    </footer>
  );
};
export default Footer;

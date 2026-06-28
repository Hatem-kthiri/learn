import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4338ca] flex items-center justify-center p-4">
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur rounded-3xl mb-6">
        <i className="fas fa-graduation-cap text-white text-3xl"></i>
      </div>
      <h1 className="text-8xl font-black text-white mb-4">404</h1>
      <p className="text-indigo-200 text-lg mb-2 font-semibold">Page Not Found</p>
      <p className="text-indigo-300/70 mb-8 max-w-sm mx-auto">The page you were looking for could not be found.</p>
      <Link to="/login" className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-7 py-3.5 rounded-2xl hover:bg-indigo-50 transition-all shadow-xl">
        <i className="fas fa-home"></i> Go to Homepage
      </Link>
    </div>
  </div>
);

export default NotFound;

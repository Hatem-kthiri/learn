import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { current } from "../../redux/actions/Actions";
import { useEffect } from "react";

const HeaderI = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.LoginReducer);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { dispatch(current()); }, []);

  const Logout = () => { localStorage.removeItem("accessToken"); navigate("/login"); window.location.reload(); };

  const navLinks = [
    { to: "/dashboard-instructor", label: "Dashboard", icon: "fas fa-th-large" },
    { to: "/students-list", label: "Students", icon: "fas fa-users" },
    { to: "/checkpoints", label: "Checkpoints", icon: "fas fa-flag-checkered" },
    { to: "/meetings", label: "Meetings", icon: "fas fa-video" },
    { to: "/workshops", label: "Workshops", icon: "fas fa-tools" },
    { to: "/chat", label: "Chat", icon: "fas fa-comments" },
  ];

  const isActive = (to) => location.pathname === to || location.pathname.startsWith(to + "/");

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/dashboard-instructor" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
            <i className="fas fa-graduation-cap text-white text-sm"></i>
          </div>
          <span className="font-bold text-slate-900 text-lg hidden sm:block">LearnToCode</span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${isActive(l.to) ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}>
              <i className={`${l.icon} text-xs`}></i> {l.label}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors">
              <img src={user.profileImg} alt="" className="w-8 h-8 rounded-xl object-cover bg-slate-100 flex-shrink-0" />
              <span className="text-sm font-semibold text-slate-700 hidden sm:block">{user.firstName}</span>
              <i className="fas fa-chevron-down text-xs text-slate-400"></i>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 mb-1">
                  <p className="text-sm font-bold text-slate-900">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <Link to="/profile-instructor" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                  <i className="fas fa-user w-4 text-slate-400 text-xs"></i> My Profile
                </Link>
                <Link to="/change-password-instructor" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                  <i className="fas fa-key w-4 text-slate-400 text-xs"></i> Change Password
                </Link>
                <div className="border-t border-slate-100 mt-1 pt-1">
                  <button onClick={Logout} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full">
                    <i className="fas fa-sign-out-alt w-4 text-xs"></i> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Mobile menu */}
          <button className="md:hidden w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500" onClick={() => setMenuOpen(!menuOpen)}>
            <i className="fas fa-bars text-sm"></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderI;

import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { current } from "../../redux/actions/Actions";
import { useEffect } from "react";
import { change_night_mode } from "../../redux/actions/StudentAction";

const HeaderI = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.LoginReducer);
  const [menuOpen, setMenuOpen] = useState(false);
  const { night_mode } = useSelector((state) => state.StudentReducer);

  useEffect(() => {
    dispatch(current());
  }, []);
  const toggleNight = () => {
    dispatch(change_night_mode(!night_mode));
  };

  const Logout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
    window.location.reload();
  };

  const navLinks = [
    {
      to: "/dashboard-instructor",
      label: "Dashboard",
      icon: "fas fa-th-large",
    },
    { to: "/students-list", label: "Students", icon: "fas fa-users" },
    { to: "/checkpoints", label: "Checkpoints", icon: "fas fa-flag-checkered" },
    { to: "/meetings", label: "Meetings", icon: "fas fa-video" },
    { to: "/workshops", label: "Workshops", icon: "fas fa-tools" },
    { to: "/chat", label: "Chat", icon: "fas fa-comments" },
  ];

  const isActive = (to) =>
    location.pathname === to || location.pathname.startsWith(to + "/");

  const dm = night_mode;
  const headerBg = dm
    ? "bg-gray-900 border-gray-700"
    : "bg-white border-slate-100";
  const logoText = dm ? "text-white" : "text-slate-900";
  const navBase = dm
    ? "text-gray-300 hover:bg-gray-800 hover:text-white"
    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900";
  const dropdownBg = dm
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-slate-100";
  const dropdownText = dm
    ? "text-gray-200 hover:bg-gray-700"
    : "text-slate-700 hover:bg-slate-50";
  const dropdownMeta = dm ? "text-gray-400" : "text-slate-500";
  const iconBtn = dm
    ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
    : "bg-slate-100 hover:bg-slate-200 text-slate-500";

  return (
    <header className={`sticky top-0 z-40 border-b shadow-sm ${headerBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to="/dashboard-instructor"
          className="flex items-center gap-2.5 flex-shrink-0"
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
            <i className="fas fa-graduation-cap text-white text-sm"></i>
          </div>
          <span className={`font-bold text-lg hidden sm:block ${logoText}`}>
            LearnToCode
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${isActive(l.to) ? "bg-indigo-600 text-white shadow-sm" : navBase}`}
            >
              <i className={`${l.icon} text-xs`}></i> {l.label}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <button
            onClick={toggleNight}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${iconBtn}`}
            title={dm ? "Light mode" : "Dark mode"}
          >
            <i
              className={`fas ${dm ? "fa-sun text-amber-400" : "fa-moon"} text-sm`}
            ></i>
          </button>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl transition-colors ${dm ? "hover:bg-gray-800" : "hover:bg-slate-100"}`}
            >
              <img
                src={user.profileImg}
                alt=""
                className="w-8 h-8 rounded-xl object-cover bg-slate-200 flex-shrink-0"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <span
                className={`text-sm font-semibold hidden sm:block ${dm ? "text-gray-200" : "text-slate-700"}`}
              >
                {user.firstName}
              </span>
              <i
                className={`fas fa-chevron-down text-xs ${dm ? "text-gray-500" : "text-slate-400"}`}
              ></i>
            </button>
            {menuOpen && (
              <div
                className={`absolute right-0 mt-2 w-52 rounded-2xl shadow-xl border py-2 z-50 ${dropdownBg}`}
              >
                <div
                  className={`px-4 py-2 border-b mb-1 ${dm ? "border-gray-700" : "border-slate-100"}`}
                >
                  <p
                    className={`text-sm font-bold ${dm ? "text-white" : "text-slate-900"}`}
                  >
                    {user.firstName} {user.lastName}
                  </p>
                  <p className={`text-xs ${dropdownMeta}`}>{user.email}</p>
                </div>
                <Link
                  to="/profile-instructor"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${dropdownText}`}
                >
                  <i className="fas fa-user w-4 text-xs opacity-60"></i> My
                  Profile
                </Link>
                <Link
                  to="/change-password-instructor"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${dropdownText}`}
                >
                  <i className="fas fa-key w-4 text-xs opacity-60"></i> Change
                  Password
                </Link>
                <div
                  className={`border-t mt-1 pt-1 ${dm ? "border-gray-700" : "border-slate-100"}`}
                >
                  <button
                    onClick={Logout}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full"
                  >
                    <i className="fas fa-sign-out-alt w-4 text-xs"></i> Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile burger */}
          <button
            className={`md:hidden w-9 h-9 rounded-xl flex items-center justify-center ${iconBtn}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <i className="fas fa-bars text-sm"></i>
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <div
          className={`md:hidden border-t px-4 py-3 space-y-1 ${dm ? "bg-gray-900 border-gray-700" : "bg-white border-slate-100"}`}
        >
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive(l.to) ? "bg-indigo-600 text-white" : navBase}`}
            >
              <i className={`${l.icon} text-xs`}></i> {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default HeaderI;

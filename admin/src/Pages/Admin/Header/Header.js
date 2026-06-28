import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { collapse } from "../../../redux/actions/Actions";

const Header = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const collapseSideBar = () => {
    setCollapsed(!collapsed);
    dispatch(collapse());
  };

  const navItems = [
    { path: "/dashboard", icon: "fas fa-th-large", label: "Dashboard" },
    { path: "/mycourse", icon: "fas fa-book-open", label: "Courses" },
    { path: "/createCourse", icon: "fas fa-plus-circle", label: "Create Course" },
    { path: "/students-list", icon: "fas fa-users", label: "Students" },
    { path: "/instructors-list", icon: "fas fa-chalkboard-teacher", label: "Instructors" },
    { path: "/guild", icon: "fas fa-award", label: "Guild" },
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <>
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full ${collapsed ? "w-16" : "w-64"} bg-[#1e1b4b] flex flex-col z-50 transition-all duration-300 shadow-2xl`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <i className="fas fa-graduation-cap text-white text-sm"></i>
          </div>
          {!collapsed && (
            <div>
              <span className="text-white font-bold text-lg leading-tight">LearnToCode</span>
              <p className="text-indigo-300 text-xs">Admin Panel</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : ""}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 font-medium group
                ${isActive(item.path)
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50"
                  : "text-indigo-200 hover:text-white hover:bg-white/10"
                }`}
            >
              <i className={`${item.icon} text-base w-5 flex-shrink-0 text-center`}></i>
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Collapse Toggle */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={collapseSideBar}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-indigo-300 hover:text-white hover:bg-white/10 transition-all duration-200 w-full"
          >
            <i className={`fas ${collapsed ? "fa-chevron-right" : "fa-chevron-left"} text-sm w-5 flex-shrink-0 text-center`}></i>
            {!collapsed && <span className="text-sm font-medium">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Top bar */}
      <header className={`fixed top-0 right-0 ${collapsed ? "left-16" : "left-64"} h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 z-40 transition-all duration-300`}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-slate-500 font-medium">System Online</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors">
            <i className="fas fa-bell text-sm"></i>
          </button>
          <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
              <i className="fas fa-user text-white text-sm"></i>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-800 leading-tight">Admin</p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

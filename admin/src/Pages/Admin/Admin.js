import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import { useSelector } from "react-redux";

const Admin = () => {
  const { verticalNav } = useSelector((state) => state.verticalReducer);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div
        className={`transition-all duration-300 pt-16 ${verticalNav ? "ml-64" : "ml-16"}`}
      >
        <main className="p-6 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Admin;

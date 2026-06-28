import React, { useEffect } from "react";
import HeaderS from "../../../Components/Header/HeaderS";
import { current } from "../../../redux/actions/Actions";
import { useDispatch, useSelector } from "react-redux";
import { get_student_workshops } from "../../../redux/actions/StudentAction";
import Footer from "../../../Components/Footer/Footer";

const WorkShopList = () => {
  const dispatch = useDispatch();
  const { user, userLoading } = useSelector((state) => state.LoginReducer);
  const { workshops } = useSelector((state) => state.StudentReducer);

  useEffect(() => { dispatch(current()); }, []);
  useEffect(() => {
    if (!userLoading && user.course?.[0]?.guild) dispatch(get_student_workshops(user.course[0].guild));
  }, [userLoading]);

  return (
    <div className="min-h-screen bg-slate-50">
      <HeaderS />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Workshops</h1>
          <p className="text-slate-500 text-sm mt-1">{workshops?.length || 0} workshops available for your guild</p>
        </div>

        {workshops?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {workshops.map((workshop, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-md transition-shadow">
                {workshop.image ? (
                  <div className="h-40 overflow-hidden">
                    <img src={workshop.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                ) : (
                  <div className="h-40 bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                    <i className="fas fa-tools text-white text-4xl opacity-50"></i>
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 mb-1">{workshop.title || workshop.name}</h3>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-4">{workshop.description}</p>
                  {workshop.date && (
                    <p className="text-xs text-slate-400 mb-4"><i className="fas fa-calendar-alt mr-1.5"></i>{new Date(workshop.date).toLocaleDateString()}</p>
                  )}
                  {workshop.link && (
                    <a href={workshop.link} target="_blank" rel="noreferrer"
                      className="block text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">
                      <i className="fas fa-external-link-alt mr-2"></i> Join Workshop
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 py-24 text-center text-slate-400">
            <i className="fas fa-tools text-5xl mb-4 block opacity-20"></i>
            <p className="font-semibold text-lg">No workshops available yet</p>
            <p className="text-sm mt-1">Your instructor hasn't scheduled any workshops for your guild.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default WorkShopList;

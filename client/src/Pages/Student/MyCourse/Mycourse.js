import React, { useEffect } from "react";
import HeaderS from "../../../Components/Header/HeaderS";
import { current } from "../../../redux/actions/Actions";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Footer from "../../../Components/Footer/Footer";

const Mycourse = () => {
  const dispatch = useDispatch();
  const { user, userLoading } = useSelector((state) => state.LoginReducer);
  const { night_mode } = useSelector((state) => state.StudentReducer);
  useEffect(() => { dispatch(current()); }, []);

  return (
    <div className={`min-h-screen flex flex-col ${night_mode ? "bg-gray-900" : "bg-slate-50"}`}>
      <HeaderS />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">My Courses</h1>
          <p className="text-slate-500 text-sm mt-1">Your enrolled learning paths</p>
        </div>

        {!userLoading && user.course?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {user.course.map((enrollment, i) => {
              const course = enrollment.course;
              const resumeId = course?.data?.[0]?.superSkills?.[0]?._id;
              return (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-md transition-shadow">
                  {course?.image ? (
                    <div className="h-44 overflow-hidden">
                      <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  ) : (
                    <div className="h-44 bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                      <i className="fas fa-book-open text-white text-4xl opacity-50"></i>
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-bold text-slate-900 text-lg mb-1">{course?.title}</h3>
                    <p className="text-slate-500 text-sm line-clamp-2 mb-4">{course?.description}</p>

                    {/* Progress bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-slate-500 font-medium">Progress</span>
                        <span className="text-xs font-bold text-indigo-600">{enrollment.learnProgress || 0}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${enrollment.learnProgress || 0}%` }}></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold bg-indigo-100 text-indigo-700">
                        Score: {enrollment.learnScore || 0}
                      </span>
                      {resumeId && (
                        <Link to={`/course/${course.data[0]._id}/${resumeId}`}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl text-xs transition-colors">
                          <i className="fas fa-play mr-1.5"></i> Continue
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 py-24 text-center text-slate-400">
            <i className="fas fa-book-open text-5xl mb-4 block opacity-20"></i>
            <p className="font-semibold text-lg">No courses enrolled yet</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Mycourse;

import React, { useEffect, useState } from "react";
import HeaderS from "../../../Components/Header/HeaderS";
import { current } from "../../../redux/actions/Actions";
import { useDispatch } from "react-redux";
import axios from "axios";
import { url } from "../../../utils";
import Footer from "../../../Components/Footer/Footer";

const Courses = () => {
  const dispatch = useDispatch();
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    dispatch(current());
    axios.get(`${url}/api/admin/getCourse`).then((r) => setCourses(r.data.courses)).catch(console.log);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <HeaderS />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">All Courses</h1>
          <p className="text-slate-500 text-sm mt-1">{courses.length} courses available</p>
        </div>
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {courses.map((course, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-md transition-shadow">
                {course.image ? (
                  <div className="h-40 overflow-hidden"><img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /></div>
                ) : (
                  <div className="h-40 bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center"><i className="fas fa-book-open text-white text-4xl opacity-50"></i></div>
                )}
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 text-base mb-1 line-clamp-1">{course.title}</h3>
                  <p className="text-slate-500 text-sm line-clamp-2">{course.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 py-24 text-center text-slate-400">
            <i className="fas fa-book-open text-5xl mb-4 block opacity-20"></i>
            <p className="font-semibold text-lg">No courses available yet</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};
export default Courses;

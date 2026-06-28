import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../utils/api";
import Swal from "sweetalert2";

const MyCourse = () => {
  const [myCourse, setMyCourse] = useState([]);
  const [search, setSearch] = useState("");

  const getMyCourse = () => {
    api.get("/api/admin/getCourse").then((r) => setMyCourse(r.data.courses)).catch(console.log);
  };
  useEffect(() => { getMyCourse(); }, []);

  const handleDelete = (id) => {
    Swal.fire({ title: "Delete this course?", icon: "warning", showCancelButton: true, confirmButtonColor: "#4f46e5", cancelButtonColor: "#ef4444", confirmButtonText: "Yes, delete" })
      .then((r) => { if (r.isConfirmed) api.delete(`/api/admin/delete_course/${id}`).then(getMyCourse); });
  };

  const filtered = myCourse.filter((c) => c.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Courses</h1>
          <p className="text-slate-500 text-sm mt-1">{myCourse.length} courses available</p>
        </div>
        <Link to="/createCourse" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-sm inline-flex items-center gap-2 shadow-sm">
          <i className="fas fa-plus"></i> Create Course
        </Link>
      </div>

      {/* Search */}
      <div className="mb-5 relative max-w-sm">
        <input type="text" placeholder="Search courses..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm" />
        <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((course) => (
          <div key={course._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-md transition-shadow">
            {course.image && (
              <div className="h-40 overflow-hidden bg-slate-100">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
            )}
            {!course.image && (
              <div className="h-40 bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <i className="fas fa-book-open text-white text-4xl opacity-50"></i>
              </div>
            )}
            <div className="p-5">
              <h3 className="font-bold text-slate-900 text-base mb-1 line-clamp-1">{course.title}</h3>
              <p className="text-slate-500 text-sm line-clamp-2 mb-4">{course.description}</p>
              <div className="flex items-center gap-2">
                <Link to={`/editCourse/${course._id}`} className="flex-1 flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold py-2 rounded-xl text-sm transition-colors">
                  <i className="fas fa-edit text-xs"></i> Edit
                </Link>
                <button onClick={() => handleDelete(course._id)} className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-500 font-semibold py-2 rounded-xl text-sm transition-colors">
                  <i className="fas fa-trash-alt text-xs"></i> Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-20 text-slate-400">
            <i className="fas fa-book-open text-5xl mb-4 block opacity-20"></i>
            <p className="font-semibold text-lg">No courses found</p>
            <Link to="/createCourse" className="inline-flex items-center gap-2 mt-4 bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm">
              <i className="fas fa-plus"></i> Create your first course
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourse;

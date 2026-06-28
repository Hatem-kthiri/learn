import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../utils/api";
import Swal from "sweetalert2";

const InstructorList = () => {
  const [Instructor, setInstructor] = useState([]);
  const [search, setSearch] = useState("");

  const getInstructors = () => {
    api.get("/api/admin/getInstructors").then((res) => setInstructor(res.data.data)).catch(() => {});
  };
  useEffect(() => { getInstructors(); }, []);

  const handleDelete = (id) => {
    Swal.fire({ title: "Delete instructor?", icon: "warning", showCancelButton: true, confirmButtonColor: "#4f46e5", cancelButtonColor: "#ef4444", confirmButtonText: "Yes, delete" })
      .then((r) => { if (r.isConfirmed) { api.delete(`/api/admin/delete_instructor/${id}`).then(getInstructors); } });
  };

  const filtered = Instructor.filter((i) =>
    `${i.firstName} ${i.lastName} ${i.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Instructors</h1>
          <p className="text-slate-500 text-sm mt-1">{Instructor.length} instructors registered</p>
        </div>
        <Link to="/add-instructor" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-sm inline-flex items-center gap-2 shadow-sm">
          <i className="fas fa-plus"></i> Add Instructor
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text" placeholder="Search instructors..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["", "Instructor", "Email", "Phone", "Guild", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((inst) => (
                <tr key={inst._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4">
                    <img src={inst.profileImg} alt="" className="w-9 h-9 rounded-xl object-cover bg-slate-100" />
                  </td>
                  <td className="px-4 py-4 font-semibold text-slate-900">{inst.firstName} {inst.lastName}</td>
                  <td className="px-4 py-4 text-slate-500">{inst.email}</td>
                  <td className="px-4 py-4 text-slate-500">{inst.phone}</td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">{inst.guild}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <Link to={`/edit-instructor/${inst._id}`} className="w-8 h-8 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 flex items-center justify-center transition-colors">
                        <i className="fas fa-edit text-xs"></i>
                      </Link>
                      <button onClick={() => handleDelete(inst._id)} className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors">
                        <i className="fas fa-trash-alt text-xs"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-16 text-slate-400">
                  <i className="fas fa-chalkboard-teacher text-4xl mb-3 block opacity-30"></i>
                  <p className="font-medium">No instructors found</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InstructorList;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../utils/api";
import ModalEditStudent from "./ModalEditStudent";
import Swal from "sweetalert2";

const StudentList = () => {
  const [Students, setStudents] = useState([]);
  const [config, setConfig] = useState({ show: false });
  const [studentId, setStudentId] = useState(null);
  const [editStudent, setEditStudent] = useState(null);
  const [search, setSearch] = useState("");

  const getStudent = () => {
    api.get("/api/admin/getStudents").then((res) => setStudents(res.data.data)).catch(console.log);
  };
  useEffect(() => { getStudent(); }, []);

  const handleShow = (id) => { setStudentId(id); setConfig({ show: true }); };
  const closeModal = () => setConfig({ show: false });

  const handleDelete = (id) => {
    Swal.fire({ title: "Delete student?", text: "This action cannot be undone.", icon: "warning", showCancelButton: true, confirmButtonColor: "#4f46e5", cancelButtonColor: "#ef4444", confirmButtonText: "Yes, delete" })
      .then((r) => { if (r.isConfirmed) { api.delete(`/api/admin/delete_student/${id}`).then(getStudent); Swal.fire("Deleted!", "", "success"); } });
  };

  const filtered = Students.filter((s) =>
    `${s.firstName} ${s.lastName} ${s.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Students</h1>
            <p className="text-slate-500 text-sm mt-1">{Students.length} total students enrolled</p>
          </div>
          <Link to="/add-student" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 inline-flex items-center gap-2 shadow-sm text-sm">
            <i className="fas fa-plus"></i> Add Student
          </Link>
        </div>

        {/* Search + Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="p-5 border-b border-slate-100 flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <input
                type="text" placeholder="Search students..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
            </div>
            <span className="text-sm text-slate-500">{filtered.length} results</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["", "Student", "Email", "Phone", "Address", "Course", "Guild", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4">
                      <img src={student.profileImg} alt="" className="w-9 h-9 rounded-xl object-cover bg-slate-100" />
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-900">{student.firstName} {student.lastName}</p>
                    </td>
                    <td className="px-4 py-4 text-slate-500">{student.email}</td>
                    <td className="px-4 py-4 text-slate-500">{student.phone}</td>
                    <td className="px-4 py-4 text-slate-500 max-w-[140px] truncate">{student.address}</td>
                    <td className="px-4 py-4">
                      {student.course?.map((el, i) => (
                        <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 mr-1">{el.course?.title}</span>
                      ))}
                    </td>
                    <td className="px-4 py-4">
                      {student.course?.map((el, i) => (
                        <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 mr-1">{el.guild}</span>
                      ))}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleShow(student._id)} className="w-8 h-8 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 flex items-center justify-center transition-colors" title="Edit">
                          <i className="fas fa-edit text-xs"></i>
                        </button>
                        <Link to={`/student-payment/${student._id}`} className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition-colors" title="Payments">
                          <i className="fas fa-file-invoice-dollar text-xs"></i>
                        </Link>
                        <button onClick={() => handleDelete(student._id)} className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors" title="Delete">
                          <i className="fas fa-trash-alt text-xs"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-16 text-slate-400">
                    <i className="fas fa-users text-4xl mb-3 block opacity-30"></i>
                    <p className="font-medium">No students found</p>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ModalEditStudent config={config} closeModal={closeModal} student={editStudent} setStudent={setEditStudent} studentId={studentId} getStudent={getStudent} />
    </>
  );
};

export default StudentList;

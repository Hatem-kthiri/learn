import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";

const AddStudent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [guilds, setGuilds] = useState([]);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", address: "", password: "", courseId: "", guild: "" });

  useEffect(() => {
    api.get("/api/admin/getCourse").then((r) => setCourses(r.data.courses));
    api.get("/api/admin/getGuild").then((r) => setGuilds(r.data.guilds));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    api.post("/api/admin/add_student", form)
      .then(() => { toast.success("Student added!"); setTimeout(() => navigate("/students-list"), 1500); })
      .catch((err) => { toast.error(err.response?.data?.message || "Error adding student"); setLoading(false); });
  };

  const fields = [
    { name: "firstName", label: "First Name", type: "text", icon: "fas fa-user" },
    { name: "lastName", label: "Last Name", type: "text", icon: "fas fa-user" },
    { name: "email", label: "Email Address", type: "email", icon: "fas fa-envelope" },
    { name: "phone", label: "Phone Number", type: "text", icon: "fas fa-phone" },
    { name: "address", label: "Address", type: "text", icon: "fas fa-map-marker-alt" },
    { name: "password", label: "Password", type: "password", icon: "fas fa-lock" },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 transition-colors">
          <i className="fas fa-arrow-left text-sm"></i>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Add Student</h1>
          <p className="text-slate-500 text-sm mt-0.5">Register a new student</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {fields.map((f) => (
                <div key={f.name}>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">{f.label}</label>
                  <div className="relative">
                    <input
                      type={f.type} name={f.name} required
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                    <i className={`${f.icon} absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs`}></i>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Course</label>
                <select name="courseId" required onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
                  <option value="">Select course</option>
                  {courses.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Guild</label>
                <select name="guild" required onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
                  <option value="">Select guild</option>
                  {guilds.map((g) => <option key={g._id} value={g.name}>{g.name}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => navigate(-1)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition-all text-sm">
                Cancel
              </button>
              <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2">
                {loading ? <ClipLoader color="#fff" size={18} /> : <><i className="fas fa-user-plus"></i> Add Student</>}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddStudent;

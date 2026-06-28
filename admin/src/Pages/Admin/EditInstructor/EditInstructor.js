import React, { useEffect, useState } from "react";
import api from "../../../utils/api";
import { useNavigate, useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

const EditInstructor = () => {
  const [instructor, setInstructor] = useState({});
  const [course, setCourse] = useState([]);
  const [guild, setGuild] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    api.get("/api/admin/getCourse/").then((r) => setCourse(r.data.courses)).catch(() => {});
    api.get("/api/admin/getGuild/").then((r) => setGuild(r.data.data)).catch(() => {});
    api.get(`/api/admin/getInstructor/${id}`).then((r) => setInstructor(r.data.data)).catch(() => {});
  }, [id]);

  const handleChange = (e) => setInstructor({ ...instructor, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    api.put(`/api/admin/edit-instructor/${id}`, { ...instructor })
      .then(() => navigate("/instructors-list"))
      .catch(() => setLoading(false));
  };

  const fields = [
    { name: "firstName", label: "First Name", type: "text", icon: "fas fa-user" },
    { name: "lastName", label: "Last Name", type: "text", icon: "fas fa-user" },
    { name: "email", label: "Email", type: "email", icon: "fas fa-envelope" },
    { name: "phone", label: "Phone", type: "text", icon: "fas fa-phone" },
    { name: "address", label: "Address", type: "text", icon: "fas fa-map-marker-alt" },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 transition-colors">
          <i className="fas fa-arrow-left text-sm"></i>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Instructor</h1>
          <p className="text-slate-500 text-sm mt-0.5">Update instructor information</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
          {/* Avatar */}
          {instructor.profileImg && (
            <div className="flex items-center gap-4 mb-7 pb-7 border-b border-slate-100">
              <img src={instructor.profileImg} alt="" className="w-16 h-16 rounded-2xl object-cover bg-slate-100" />
              <div>
                <p className="font-bold text-slate-900">{instructor.firstName} {instructor.lastName}</p>
                <p className="text-sm text-slate-500">{instructor.email}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {fields.map((f) => (
                <div key={f.name}>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">{f.label}</label>
                  <div className="relative">
                    <input type={f.type} name={f.name} value={instructor[f.name] || ""} onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                    <i className={`${f.icon} absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs`}></i>
                  </div>
                </div>
              ))}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Guild</label>
                <select name="guild" value={instructor.guild || ""} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
                  <option value="">Select guild</option>
                  {guild.map((g) => <option key={g._id} value={g.name}>{g.name}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => navigate(-1)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition-all text-sm">Cancel</button>
              <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2">
                {loading ? <ClipLoader color="#fff" size={18} /> : <><i className="fas fa-save"></i> Save Changes</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditInstructor;

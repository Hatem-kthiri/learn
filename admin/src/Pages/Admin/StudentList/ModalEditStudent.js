import React, { useEffect, useState } from "react";
import api from "../../../utils/api";
import ClipLoader from "react-spinners/ClipLoader";

const ModalEditStudent = ({ config, closeModal, studentId, getStudent }) => {
  const [studentInfo, setStudentInfo] = useState({});
  const [selectShow, setSelectShow] = useState(false);
  const [course, setCourse] = useState([]);
  const [guild, setGuild] = useState([]);
  const [selectIndex, setSelectIndex] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setStudentInfo({ ...studentInfo, [e.target.name]: e.target.value });

  const handleEditSubmit = () => {
    setLoading(true);
    api.put(`/api/admin/updateStudent/${studentId}`, studentInfo)
      .then(() => { getStudent(); closeModal(); setLoading(false); })
      .catch((err) => { console.log(err); setLoading(false); });
  };

  useEffect(() => {
    if (studentId) {
      api.get(`/api/admin/getStudentInfo/${studentId}`).then((r) => setStudentInfo(r.data.data)).catch(() => {});
    }
  }, [studentId]);

  useEffect(() => {
    api.get("/api/admin/getCourse/").then((r) => setCourse(r.data.courses)).catch(() => {});
    api.get("/api/admin/getGuild/").then((r) => setGuild(r.data.data)).catch(() => {});
  }, []);

  const dateFunction = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  };

  if (!config.show) return null;

  const fields = [
    { name: "firstName", label: "First Name", type: "text", defaultVal: studentInfo.firstName },
    { name: "lastName", label: "Last Name", type: "text", defaultVal: studentInfo.lastName },
    { name: "email", label: "Email", type: "email", defaultVal: studentInfo.email },
    { name: "address", label: "Address", type: "text", defaultVal: studentInfo.address },
    { name: "phone", label: "Phone", type: "text", defaultVal: studentInfo.phone },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={closeModal}></div>
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {studentInfo.profileImg && <img src={studentInfo.profileImg} alt="" className="w-10 h-10 rounded-xl object-cover" />}
            <div>
              <h3 className="font-bold text-slate-900">Edit Student</h3>
              <p className="text-xs text-slate-500">{studentInfo.firstName} {studentInfo.lastName}</p>
            </div>
          </div>
          <button onClick={closeModal} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors">
            <i className="fas fa-times text-sm"></i>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {fields.map((f) => (
              <div key={f.name} className={f.name === "email" ? "col-span-2" : ""}>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">{f.label}</label>
                <input type={f.type} name={f.name} defaultValue={f.defaultVal || ""}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
              </div>
            ))}

            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Expiry Date</label>
              <input type="date" name="expiryDate" defaultValue={config.show ? dateFunction(studentInfo.expiryDate) : ""}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Course</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                onChange={(e) => { if (e.target.value !== "") { setSelectShow(true); setSelectIndex(e.target.value); } }}>
                <option value="">Select course</option>
                {studentInfo.course?.map((c, i) => <option key={i} value={i}>{c.course?.title}</option>)}
              </select>
            </div>

            {selectShow && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Guild</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  onChange={(e) => { if (studentInfo.course) studentInfo.course[selectIndex].guild = e.target.value; }}>
                  <option value="">Select guild</option>
                  {guild.map((g) => <option key={g._id} value={g.name}>{g.name}</option>)}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-slate-100">
          <button onClick={closeModal} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-sm transition-all">Cancel</button>
          <button onClick={handleEditSubmit} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
            {loading ? <ClipLoader color="#fff" size={18} /> : <><i className="fas fa-save"></i> Update</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditStudent;

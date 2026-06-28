import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../utils/api";
import ClipLoader from "react-spinners/ClipLoader";

const PaymentForm = () => {
  const { studentId } = useParams();
  const [course, setCourse] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ numberOfMonth: "", course: "", price: "", paymentDate: Date.now() });

  useEffect(() => {
    api.get("/api/admin/getCourse/").then((r) => setCourse(r.data.courses)).catch(console.log);
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    api.put(`/api/admin/add-payment/${studentId}`, formData)
      .then(() => navigate(`/student-payment/${studentId}`))
      .catch((err) => { console.log(err); setLoading(false); });
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 transition-colors">
          <i className="fas fa-arrow-left text-sm"></i>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Add Payment</h1>
          <p className="text-slate-500 text-sm mt-0.5">Record a new payment for this student</p>
        </div>
      </div>

      <div className="max-w-lg">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Months</label>
                <div className="relative">
                  <input type="number" name="numberOfMonth" required onChange={handleChange} min="1"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                  <i className="fas fa-calendar-alt absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Price (TND)</label>
                <div className="relative">
                  <input type="number" name="price" required onChange={handleChange} min="0"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                  <i className="fas fa-money-bill-wave absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Course</label>
              <select name="course" required onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
                <option value="">Select a course</option>
                {course.map((c) => <option key={c._id} value={c.title}>{c.title}</option>)}
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => navigate(-1)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-sm transition-all">Cancel</button>
              <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all">
                {loading ? <ClipLoader color="#fff" size={18} /> : <><i className="fas fa-plus"></i> Add Payment</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import { update_workshop } from "../../../redux/actions/InstructorActions";

const EditWorkShop = ({ editConfig, closeModal, workshopId }) => {
  const { user } = useSelector((state) => state.LoginReducer);
  const [loading, setLoading] = useState(false);
  const [workshop, setWorkshop] = useState({});
  const dispatch = useDispatch();
  const instructorGuilds = Array.isArray(user?.guild) ? user.guild : (user?.guild ? [user.guild] : []);
  const handleChange = (e) => setWorkshop({ ...workshopId, ...workshop, [e.target.name]: e.target.value });
  const handleEdit = () => { setLoading(true); dispatch(update_workshop({ workshop: { ...workshopId, ...workshop }, user, setLoading, closeModal })); };

  if (!editConfig?.show) return null;

  // NOTE: field name must be "name" (not "title") to match the Workshop schema/validator
  const fields = [
    { name: "name", label: "Title", type: "text", val: workshopId?.name },
    { name: "link", label: "Link", type: "url", val: workshopId?.link },
    { name: "date", label: "Date", type: "date", val: workshopId?.date?.slice(0, 10) },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={closeModal}></div>
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">Edit Workshop</h3>
          <button onClick={closeModal} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500">
            <i className="fas fa-times text-sm"></i>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Guild</label>
            <select name="guild" defaultValue={workshopId?.guild || ""} onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
              <option value="" disabled>Select a guild</option>
              {instructorGuilds.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            {instructorGuilds.length === 0 && (
              <p className="text-xs text-red-500 mt-1">You are not assigned to any guild yet.</p>
            )}
          </div>
          {fields.map((f) => (
            <div key={f.name}>
              <label className="block text-sm font-semibold text-slate-700 mb-2">{f.label}</label>
              <input type={f.type} name={f.name} defaultValue={f.val || ""} onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
            <textarea name="description" defaultValue={workshopId?.description || ""} rows={3} onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none" />
          </div>
        </div>
        <div className="flex gap-3 p-6 border-t border-slate-100">
          <button onClick={closeModal} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-sm transition-all">Cancel</button>
          <button onClick={handleEdit} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
            {loading ? <ClipLoader color="#fff" size={18} /> : <><i className="fas fa-save"></i> Save</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditWorkShop;

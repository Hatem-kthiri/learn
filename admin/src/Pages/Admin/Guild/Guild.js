import React, { useEffect, useState } from "react";
import api from "../../../utils/api";
import Swal from "sweetalert2";

const Guild = () => {
  const [guild, setGuild] = useState([]);
  const [name, setName] = useState("");
  const [showForm, setShowForm] = useState(false);

  const getGuilds = () => {
    api.get("/api/admin/getGuild").then((r) => setGuild(r.data.data)).catch(() => {});
  };
  useEffect(() => { getGuilds(); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    api.post("/api/admin/createGuild", { name })
      .then((r) => { setGuild([...guild, r.data.data]); setName(""); setShowForm(false); })
      .catch(() => {});
  };

  const handleDelete = (id) => {
    Swal.fire({ title: "Delete guild?", icon: "warning", showCancelButton: true, confirmButtonColor: "#4f46e5", cancelButtonColor: "#ef4444", confirmButtonText: "Yes, delete" })
      .then((r) => { if (r.isConfirmed) api.delete(`/api/admin/delete_guild/${id}`).then(getGuilds); });
  };

  const colors = ["bg-indigo-100 text-indigo-700", "bg-violet-100 text-violet-700", "bg-emerald-100 text-emerald-700", "bg-amber-100 text-amber-700", "bg-rose-100 text-rose-700", "bg-sky-100 text-sky-700"];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Guilds</h1>
          <p className="text-slate-500 text-sm mt-1">{guild.length} guilds created</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-sm inline-flex items-center gap-2 shadow-sm">
          <i className={`fas ${showForm ? "fa-times" : "fa-plus"}`}></i>
          {showForm ? "Cancel" : "New Guild"}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6 max-w-md">
          <h2 className="font-bold text-slate-900 mb-4">Create New Guild</h2>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="relative flex-1">
              <input type="text" placeholder="Guild name..." value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
              <i className="fas fa-award absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            </div>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-3 rounded-xl transition-all text-sm inline-flex items-center gap-2">
              <i className="fas fa-plus text-xs"></i> Add
            </button>
          </form>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {guild.map((g, i) => (
          <div key={g._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 group hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold ${colors[i % colors.length]}`}>
                {g.name?.charAt(0).toUpperCase()}
              </div>
              <button onClick={() => handleDelete(g._id)} className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-all">
                <i className="fas fa-trash-alt text-xs"></i>
              </button>
            </div>
            <h3 className="font-bold text-slate-900">{g.name}</h3>
            <p className="text-xs text-slate-400 mt-1">Guild</p>
          </div>
        ))}

        {guild.length === 0 && (
          <div className="col-span-4 text-center py-16 text-slate-400">
            <i className="fas fa-award text-5xl mb-4 block opacity-20"></i>
            <p className="font-semibold">No guilds yet. Create one to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Guild;

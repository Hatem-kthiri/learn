import React, { useEffect, useState } from "react";
import HeaderI from "../../../Components/Header/HeaderI";
import { current } from "../../../redux/actions/Actions";
import { useDispatch, useSelector } from "react-redux";
import AddWorkShop from "./AddWorkShop";
import EditWorkShop from "./EditWorkShop";
import Swal from "sweetalert2";
import { delete_workshop, get_workshops } from "../../../redux/actions/InstructorActions";
import Footer from "../../../Components/Footer/Footer";

const Workshops = () => {
  const dispatch = useDispatch();
  const { user, userLoading } = useSelector((state) => state.LoginReducer);
  const { workshops } = useSelector((state) => state.instructorReducer);
  const [workshopId, setWorkshopId] = useState({});
  const [config, setConfig] = useState({ show: false });
  const [editConfig, setEditConfig] = useState({ show: false });

  useEffect(() => { dispatch(current()); }, []);
  useEffect(() => { if (!userLoading) dispatch(get_workshops(user._id)); }, [userLoading]);

  const handleDelete = (id) => {
    Swal.fire({ title: "Delete workshop?", icon: "warning", showCancelButton: true, confirmButtonColor: "#4f46e5", cancelButtonColor: "#ef4444", confirmButtonText: "Yes, delete" })
      .then((r) => { if (r.isConfirmed) dispatch(delete_workshop({ user, workshopId: id })); });
  };

  const handleEditShow = (id) => {
    setWorkshopId(workshops.find((w) => w._id === id));
    setEditConfig({ show: true });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <HeaderI />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Workshops</h1>
            <p className="text-slate-500 text-sm mt-1">{workshops?.length || 0} workshops created</p>
          </div>
          <button onClick={() => setConfig({ show: true })}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm inline-flex items-center gap-2 shadow-sm transition-all">
            <i className="fas fa-plus"></i> New Workshop
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {workshops?.map?.((workshop, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-md transition-shadow">
              {workshop.image ? (
                <div className="h-40 overflow-hidden"><img src={workshop.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /></div>
              ) : (
                <div className="h-40 bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                  <i className="fas fa-tools text-white text-4xl opacity-50"></i>
                </div>
              )}
              <div className="p-5">
                <h3 className="font-bold text-slate-900 mb-1">{workshop.title}</h3>
                <p className="text-slate-500 text-sm line-clamp-2 mb-4">{workshop.description}</p>
                {workshop.date && <p className="text-xs text-slate-400 mb-4"><i className="fas fa-calendar-alt mr-1.5"></i>{new Date(workshop.date).toLocaleDateString()}</p>}
                {workshop.link && (
                  <a href={workshop.link} target="_blank" rel="noreferrer" className="block text-center bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold py-2 rounded-xl text-sm transition-colors mb-3">
                    <i className="fas fa-external-link-alt mr-1.5"></i> Join Workshop
                  </a>
                )}
                <div className="flex gap-2">
                  <button onClick={() => handleEditShow(workshop._id)} className="flex-1 flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2 rounded-xl text-xs transition-colors">
                    <i className="fas fa-edit"></i> Edit
                  </button>
                  <button onClick={() => handleDelete(workshop._id)} className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-500 font-semibold py-2 rounded-xl text-xs transition-colors">
                    <i className="fas fa-trash-alt"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {(!workshops || workshops.length === 0) && (
            <div className="col-span-3 text-center py-20 text-slate-400">
              <i className="fas fa-tools text-5xl mb-4 block opacity-20"></i>
              <p className="font-semibold text-lg">No workshops yet</p>
              <button onClick={() => setConfig({ show: true })} className="mt-4 inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm">
                <i className="fas fa-plus"></i> Create first workshop
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <AddWorkShop config={config} closeModal={() => setConfig({ show: false })} user={user} />
      <EditWorkShop editConfig={editConfig} closeModal={() => setEditConfig({ show: false })} workshopId={workshopId} user={user} />
    </div>
  );
};

export default Workshops;

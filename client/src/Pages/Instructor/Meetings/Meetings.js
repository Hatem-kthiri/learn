import React, { useState, useEffect } from "react";
import HeaderI from "../../../Components/Header/HeaderI";
import { useDispatch, useSelector } from "react-redux";
import { current } from "../../../redux/actions/Actions";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { add_meeting, delete_meeting, get_meetings, update_meeting } from "../../../redux/actions/InstructorActions";
import Footer from "../../../Components/Footer/Footer";

const Meetings = () => {
  const dispatch = useDispatch();
  const { user, userLoading } = useSelector((state) => state.LoginReducer);
  const { meetings } = useSelector((state) => state.instructorReducer);
  const [showAdd, setShowAdd] = useState(false);
  const [meetDetails, setMeetDetails] = useState({});
  const [editId, setEditId] = useState(null);

  useEffect(() => { dispatch(current()); }, []);
  useEffect(() => { if (!userLoading) dispatch(get_meetings(user)); }, [user, userLoading]);

  // Guilds the logged-in instructor actually belongs to (array of guild names)
  const instructorGuilds = Array.isArray(user?.guild) ? user.guild : (user?.guild ? [user.guild] : []);

  const handleChange = (e) => setMeetDetails({ ...meetDetails, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    // Backend field is "time", not "date" - keep meetDetails.time as the source of truth
    if (!meetDetails.name || !meetDetails.link || !meetDetails.guild || !meetDetails.time) { toast.error("Please fill all fields"); return; }
    if (editId) {
      dispatch(
        update_meeting({
          user,
          modalEditDetails: { _id: editId },
          meetDetails,
          handleModalEditShow: setShowAdd,
        })
      );
      setEditId(null);
    } else {
      dispatch(
        add_meeting({
          user,
          meetDetails,
          handleModalAddShow: setShowAdd,
          resetForm: () => setMeetDetails({}),
        })
      );
    }
    setMeetDetails({}); setShowAdd(false);
  };

  const handleDelete = (id) => {
    Swal.fire({ title: "Delete meeting?", icon: "warning", showCancelButton: true, confirmButtonColor: "#4f46e5", cancelButtonColor: "#ef4444", confirmButtonText: "Yes, delete" })
      .then((r) => { if (r.isConfirmed) dispatch(delete_meeting({ user, id })); });
  };

  const handleEdit = (meeting) => {
    // Normalize "time" back into the datetime-local input format (YYYY-MM-DDTHH:mm)
    const timeValue = meeting.time ? new Date(meeting.time).toISOString().slice(0, 16) : "";
    setMeetDetails({ ...meeting, time: timeValue });
    setEditId(meeting._id);
    setShowAdd(true);
  };

  const fields = [
    { name: "name", label: "Meeting Name", type: "text", placeholder: "e.g. Weekly Standup" },
    { name: "link", label: "Meeting Link", type: "url", placeholder: "https://meet.google.com/..." },
    { name: "time", label: "Date & Time", type: "datetime-local", placeholder: "" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      <HeaderI />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Meetings</h1>
            <p className="text-slate-500 text-sm mt-1 dark:text-gray-400">{meetings?.length || 0} scheduled meetings</p>
          </div>
          <button onClick={() => { setShowAdd(!showAdd); setEditId(null); setMeetDetails({}); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm inline-flex items-center gap-2 shadow-sm transition-all">
            <i className={`fas ${showAdd ? "fa-times" : "fa-plus"}`}></i>
            {showAdd ? "Cancel" : "New Meeting"}
          </button>
        </div>

        {/* Add/Edit Form */}
        {showAdd && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6 dark:bg-gray-800 dark:border-gray-700">
            <h2 className="font-bold text-slate-900 mb-5 dark:text-white">{editId ? "Edit Meeting" : "Schedule New Meeting"}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 dark:text-gray-200">Guild</label>
                <select name="guild" value={meetDetails.guild || ""} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:bg-gray-900 dark:border-gray-600">
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
                  <label className="block text-sm font-semibold text-slate-700 mb-2 dark:text-gray-200">{f.label}</label>
                  <input type={f.type} name={f.name} placeholder={f.placeholder} value={meetDetails[f.name] || ""}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:bg-gray-900 dark:border-gray-600" />
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowAdd(false); setMeetDetails({}); }} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-sm transition-all dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200">Cancel</button>
              <button onClick={handleSubmit} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-sm transition-all inline-flex items-center justify-center gap-2">
                <i className={`fas ${editId ? "fa-save" : "fa-plus"}`}></i> {editId ? "Save Changes" : "Add Meeting"}
              </button>
            </div>
          </div>
        )}

        {/* Meetings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meetings?.map?.((meeting, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-video text-indigo-600"></i>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => handleEdit(meeting)} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-indigo-100 text-slate-500 hover:text-indigo-600 flex items-center justify-center transition-colors dark:bg-gray-700 dark:text-gray-400">
                    <i className="fas fa-edit text-xs"></i>
                  </button>
                  <button onClick={() => handleDelete(meeting._id)} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-500 flex items-center justify-center transition-colors dark:bg-gray-700 dark:text-gray-400">
                    <i className="fas fa-trash-alt text-xs"></i>
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-slate-900 mb-1 dark:text-white">{meeting.name}</h3>
              {meeting.date && <p className="text-xs text-slate-500 mb-3 dark:text-gray-400"><i className="fas fa-calendar-alt mr-1.5"></i>{new Date(meeting.date).toLocaleString()}</p>}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                  <i className="fas fa-award mr-1 text-xs"></i>{meeting.guild}
                </span>
                {meeting.link && (
                  <a href={meeting.link} target="_blank" rel="noreferrer" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-1.5 rounded-lg text-xs transition-colors inline-flex items-center gap-1.5">
                    <i className="fas fa-external-link-alt text-xs"></i> Join
                  </a>
                )}
              </div>
            </div>
          ))}
          {(!meetings || meetings.length === 0) && !showAdd && (
            <div className="col-span-2 text-center py-20 text-slate-400 dark:text-gray-500">
              <i className="fas fa-video text-5xl mb-4 block opacity-20"></i>
              <p className="font-semibold text-lg">No meetings scheduled</p>
              <button onClick={() => setShowAdd(true)} className="mt-4 inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm">
                <i className="fas fa-plus"></i> Schedule first meeting
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default Meetings;

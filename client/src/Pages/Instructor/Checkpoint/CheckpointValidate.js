import React, { useState, useEffect } from "react";
import HeaderI from "../../../Components/Header/HeaderI";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { get_checkpoints_details, update_checkpoint_score } from "../../../redux/actions/InstructorActions";
import Footer from "../../../Components/Footer/Footer";

const CheckpointValidate = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, userLoading } = useSelector((state) => state.LoginReducer);
  const { checkpointDetails } = useSelector((state) => state.instructorReducer);
  const [value, setValue] = useState("");
  const [activeTab, setActiveTab] = useState("score");

  useEffect(() => { dispatch(get_checkpoints_details(id)); }, [id]);

  const handleChange = (e) => {
    const v = e.target.value;
    if (v === "" || (v >= 0 && v <= 10)) setValue(v);
  };

  const findContent = () => {
    if (!checkpointDetails || userLoading) return null;
    try {
      const course = user.course.find((el) => el._id === checkpointDetails.student?.course?.[0]?.course);
      for (const section of course.data) {
        const found = section.superSkills?.find((el) => el._id === checkpointDetails.checkpointId);
        if (found) return found.skillsData?.[0]?.content;
      }
    } catch { return null; }
  };

  const handleSubmit = () => { dispatch(update_checkpoint_score({ id, value, navigate })); };

  return (
    <div className="min-h-screen bg-slate-50">
      <HeaderI />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/checkpoints" className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 transition-colors">
            <i className="fas fa-arrow-left text-sm"></i>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Validate Checkpoint</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {checkpointDetails?.student?.firstName} {checkpointDetails?.student?.lastName} — {checkpointDetails?.checkpointName}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-slate-100 rounded-2xl p-1.5 mb-6 shadow-sm max-w-xs">
          {[{ key: "score", label: "Score", icon: "fas fa-star" }, { key: "details", label: "Details", icon: "fas fa-file-alt" }].map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.key ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              <i className={`${tab.icon} text-xs`}></i> {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "score" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7 max-w-lg">
            <h2 className="font-bold text-slate-900 mb-5">Assign Score</h2>

            {/* Student info */}
            {checkpointDetails?.student && (
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl mb-6">
                <img src={checkpointDetails.student.profileImg} alt="" className="w-10 h-10 rounded-xl object-cover bg-slate-100" />
                <div>
                  <p className="font-bold text-slate-900">{checkpointDetails.student.firstName} {checkpointDetails.student.lastName}</p>
                  <p className="text-xs text-slate-500">{checkpointDetails.checkpointName}</p>
                </div>
              </div>
            )}

            {/* Submission link */}
            {checkpointDetails?.link && (
              <div className="mb-5">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Submission Link</label>
                <a href={checkpointDetails.link} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium bg-indigo-50 hover:bg-indigo-100 px-4 py-3 rounded-xl transition-colors break-all">
                  <i className="fas fa-external-link-alt flex-shrink-0"></i>
                  <span>{checkpointDetails.link}</span>
                </a>
              </div>
            )}

            {/* Score input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Score (0–10)</label>
              <div className="flex items-center gap-3">
                <input type="number" value={value} onChange={handleChange} min="0" max="10" placeholder="0"
                  className="w-24 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-2xl font-bold text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full transition-all duration-300" style={{ width: `${(value / 10) * 100}%` }}></div>
                </div>
                <span className="text-sm font-bold text-slate-500 w-8 text-right">/10</span>
              </div>
            </div>

            <button onClick={handleSubmit} disabled={!value}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm">
              <i className="fas fa-check-circle"></i> Submit Score
            </button>
          </div>
        )}

        {activeTab === "details" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
            <h2 className="font-bold text-slate-900 mb-5">Checkpoint Content</h2>
            {findContent() ? (
              <div className="prose max-w-none text-slate-700 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: findContent() }} />
            ) : (
              <div className="text-center py-12 text-slate-400">
                <i className="fas fa-file-alt text-4xl mb-3 block opacity-20"></i>
                <p className="font-medium">No content available</p>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CheckpointValidate;

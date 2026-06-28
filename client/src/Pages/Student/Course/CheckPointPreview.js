import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { add_checkpoint, get_checkpoint, update_checkpoint } from "../../../redux/actions/StudentAction";

const CheckPointPreview = ({ skillsData, skillsPosition, setNextButton }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.LoginReducer);
  const { checkpointSubmited } = useSelector((state) => state.StudentReducer);
  const [link, setLink] = useState("");
  const { superSkillsId, skillsId } = useParams();
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    setNextButton(false);
    if (checkpointSubmited?.link?.length > 0) setNextButton(true);
  }, [checkpointSubmited]);

  useEffect(() => {
    dispatch(get_checkpoint({ user, id: skillsId }));
  }, [skillsId]);

  const handleSubmit = async () => {
    setSubmitLoading(true);
    let superSkills = "";
    let checkpointName = "";
    user.course[0].course.data.forEach((el) => {
      if (el._id == superSkillsId) {
        superSkills = el;
        el.superSkills.forEach((skill) => { if (skill._id === skillsId) checkpointName = skill.skillsName; });
      }
    });
    dispatch(add_checkpoint({ user, id: skillsId, link, name: checkpointName }));
    setSubmitLoading(false);
  };

  const handleUpdate = (id) => {
    setSubmitLoading(true);
    dispatch(update_checkpoint({ user, id, link }));
    setSubmitLoading(false);
  };

  const isClosed = checkpointSubmited && !checkpointSubmited.open;
  const isSubmitted = checkpointSubmited !== undefined;

  return (
    <div>
      {/* Checkpoint badge */}
      <div className="flex items-center gap-2 mb-5">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
          <i className="fas fa-flag-checkered"></i> Checkpoint
        </span>
        {isClosed && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
            <i className="fas fa-star text-xs"></i> Score: {checkpointSubmited.score}/10
          </span>
        )}
      </div>

      {/* Submission form */}
      {!isClosed && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
          <h3 className="font-bold text-slate-900 mb-1">Submit Your Work</h3>
          <p className="text-sm text-slate-500 mb-4">Paste your GitHub or project link below</p>

          {checkpointSubmited?.link && (
            <div className="mb-3 p-3 bg-white border border-amber-200 rounded-xl">
              <p className="text-xs font-semibold text-slate-500 mb-1">Current submission</p>
              <a href={checkpointSubmited.link} target="_blank" rel="noreferrer" className="text-indigo-600 text-sm hover:underline break-all">{checkpointSubmited.link}</a>
            </div>
          )}

          <div className="flex gap-3">
            <input type="url" placeholder="https://github.com/..." value={link} onChange={(e) => setLink(e.target.value)}
              className="flex-1 bg-white border border-amber-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all" />
            <button
              onClick={!isSubmitted ? handleSubmit : () => handleUpdate(checkpointSubmited._id)}
              disabled={!link}
              className="bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2">
              {submitLoading ? <ClipLoader color="#fff" size={16} /> : (isSubmitted ? "Update" : "Submit")}
            </button>
          </div>
        </div>
      )}

      {isClosed && (
        <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center flex-shrink-0">
            <i className="fas fa-lock text-slate-500"></i>
          </div>
          <div>
            <p className="font-bold text-slate-700 text-sm">Checkpoint Closed</p>
            <p className="text-xs text-slate-500">Your submission has been reviewed. Score: {checkpointSubmited.score}/10</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="prose max-w-none text-slate-800 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: skillsData[skillsPosition].content }} />
    </div>
  );
};

export default CheckPointPreview;

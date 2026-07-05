import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { add_checkpoint, get_checkpoint, update_checkpoint } from "../../../redux/actions/StudentAction";

const CheckPointPreview = ({ skillsData, skillsPosition, setNextButton, nightMode }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.LoginReducer);
  const { checkpointSubmited } = useSelector((state) => state.StudentReducer);
  const [link, setLink] = useState("");
  const { superSkillsId, skillsId } = useParams();
  const [submitLoading, setSubmitLoading] = useState(false);
  const dm = nightMode;

  useEffect(() => {
    setNextButton(false);
    if (checkpointSubmited?.link?.length > 0) setNextButton(true);
  }, [checkpointSubmited]);

  useEffect(() => { dispatch(get_checkpoint({ user, id: skillsId })); }, [skillsId]);

  const handleSubmit = () => {
    setSubmitLoading(true);
    let checkpointName = "";
    user.course[0].course.data.forEach((el) => {
      el.superSkills?.forEach((skill) => { if (skill._id === skillsId) checkpointName = skill.skillsName; });
    });
    dispatch(add_checkpoint({
      checkpointName,
      checkpointId: skillsId,
      student: user._id,
      guild: user.guild,
      link,
      user,
      setSubmitLoading,
    }));
  };

  const handleUpdate = (checkpointDocId) => {
    setSubmitLoading(true);
    dispatch(update_checkpoint({
      id: checkpointDocId,
      checkpointId: skillsId,
      link,
      user,
      setSubmitLoading,
    }));
  };

  const isClosed = checkpointSubmited && !checkpointSubmited.open;
  const isSubmitted = checkpointSubmited !== undefined;

  const cardBg = dm ? "bg-amber-900/30 border-amber-700" : "bg-amber-50 border-amber-200";
  const closedBg = dm ? "bg-gray-700 border-gray-600" : "bg-slate-100 border-slate-200";
  const inputCls = dm ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-indigo-500" : "bg-white border-amber-200 text-slate-800 placeholder-slate-400 focus:ring-amber-400";
  const submittedBg = dm ? "bg-gray-700 border-gray-600" : "bg-white border-amber-200";
  const submittedText = dm ? "text-gray-300" : "text-indigo-600";
  const proseCls = dm ? "prose-invert text-gray-200" : "text-slate-800";

  return (
    <div>
      {/* Badge */}
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

      {/* Submission area */}
      {!isClosed ? (
        <div className={`border rounded-2xl p-5 mb-6 ${cardBg}`}>
          <h3 className={`font-bold mb-1 ${dm ? "text-amber-200" : "text-slate-900"}`}>Submit Your Work</h3>
          <p className={`text-sm mb-4 ${dm ? "text-amber-300/70" : "text-slate-500"}`}>Paste your GitHub or project link below</p>

          {checkpointSubmited?.link && (
            <div className={`mb-3 p-3 border rounded-xl ${submittedBg}`}>
              <p className={`text-xs font-semibold mb-1 ${dm ? "text-gray-400" : "text-slate-500"}`}>Current submission</p>
              <a href={checkpointSubmited.link} target="_blank" rel="noreferrer" className={`text-sm hover:underline break-all ${submittedText}`}>
                {checkpointSubmited.link}
              </a>
            </div>
          )}

          <div className="flex gap-3">
            <input type="url" placeholder="https://github.com/..." value={link} onChange={(e) => setLink(e.target.value)}
              className={`flex-1 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${inputCls}`} />
            <button onClick={!isSubmitted ? handleSubmit : () => handleUpdate(checkpointSubmited._id)}
              disabled={!link}
              className="bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 whitespace-nowrap">
              {submitLoading ? <ClipLoader color="#fff" size={16} /> : (isSubmitted ? "Update" : "Submit")}
            </button>
          </div>
        </div>
      ) : (
        <div className={`border rounded-2xl p-4 mb-6 flex items-center gap-3 ${closedBg}`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${dm ? "bg-gray-600" : "bg-slate-200"}`}>
            <i className={`fas fa-lock ${dm ? "text-gray-400" : "text-slate-500"}`}></i>
          </div>
          <div>
            <p className={`font-bold text-sm ${dm ? "text-gray-200" : "text-slate-700"}`}>Checkpoint Closed</p>
            <p className={`text-xs ${dm ? "text-gray-400" : "text-slate-500"}`}>Reviewed. Score: {checkpointSubmited.score}/10</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className={`prose max-w-none leading-relaxed ${dm ? "prose-invert " + proseCls : proseCls}`}
        dangerouslySetInnerHTML={{ __html: skillsData[skillsPosition]?.content }} />
    </div>
  );
};

export default CheckPointPreview;

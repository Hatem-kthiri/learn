import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { current } from "../../../redux/actions/Actions";
import HeaderS from "../../../Components/Header/HeaderS";
import { useParams, Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import {
  add_checkpoint,
  get_checkpoint,
  get_learning_schedule,
  update_checkpoint,
} from "../../../redux/actions/StudentAction";
import Footer from "../../../Components/Footer/Footer";

const Checkpoint = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { user, userLoading } = useSelector((state) => state.LoginReducer);
  const { night_mode } = useSelector((state) => state.StudentReducer);
  const { learningSchedule, checkpointSubmited } = useSelector(
    (state) => state.StudentReducer,
  );
  const [checkpointList, setCheckpointList] = useState([]);
  const [checkpointListFromLearn, setCheckpointListFromLearn] = useState([]);
  const [checkpointContent, setCheckpointContent] = useState(undefined);
  const [link, setLink] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    dispatch(current());
  }, []);
  useEffect(() => {
    if (!userLoading) dispatch(get_learning_schedule(user));
  }, [userLoading]);
  useEffect(() => {
    if (id !== undefined) dispatch(get_checkpoint({ user, id }));
    else if (checkpointList.length > 0)
      dispatch(get_checkpoint({ user, id: checkpointList[0]._id }));
  }, [user, checkpointList]);

  const extractTypeOne = (data) => {
    const result = [];
    for (const item of data) {
      for (const skill of item.superSkills || []) {
        if (skill.type === "1") result.push(skill);
      }
    }
    return result;
  };

  const extractFromLearn = (data) => {
    const result = [];
    for (const course of data.learning) {
      for (const skill of course.details || []) {
        if (skill.open && skill.type == "1") result.push(skill);
      }
    }
    return result;
  };

  useEffect(() => {
    if (!userLoading && user.course) {
      const allData = user.course.flatMap((c) => c.course?.data || []);
      setCheckpointList(extractTypeOne(allData));
    }
  }, [userLoading]);

  useEffect(() => {
    if (learningSchedule)
      setCheckpointListFromLearn(extractFromLearn(learningSchedule));
  }, [learningSchedule]);

  useEffect(() => {
    if (user.course && checkpointList.length > 0) {
      const activeId = id || checkpointList[0]._id;
      const allData = user.course.flatMap((c) => c.course?.data || []);
      for (const section of allData) {
        const found = section.superSkills?.find((el) => el._id === activeId);
        if (found) {
          setCheckpointContent(found);
          break;
        }
      }
    }
  }, [checkpointList, id]);

  const isUnlocked = (cpId) =>
    checkpointListFromLearn.some((el) => el._id === cpId);
  const isSubmitted = () =>
    checkpointSubmited &&
    checkpointSubmited._id === (id || checkpointList[0]?._id);

  const handleSubmit = () => {
    const activeId = id || checkpointList[0]?._id;
    setSubmitLoading(true);
    if (isSubmitted()) {
      // /update-checkpoint/:id expects the Checkpoint *document's* _id,
      // not the lesson id - that's checkpointSubmited._id, already loaded
      // via get_checkpoint above.
      dispatch(
        update_checkpoint({
          id: checkpointSubmited._id,
          checkpointId: activeId,
          link,
          user,
          setSubmitLoading,
        }),
      );
    } else {
      const checkpointName = checkpointContent?.title || "Checkpoint";
      dispatch(
        add_checkpoint({
          checkpointName,
          checkpointId: activeId,
          student: user._id,
          guild: user.guild,
          link,
          user,
          setSubmitLoading,
        }),
      );
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${night_mode ? "bg-gray-900" : "bg-slate-50"}`}
    >
      <HeaderS />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Checkpoints</h1>
          <p className="text-slate-500 text-sm mt-1">
            {checkpointListFromLearn.length} unlocked checkpoints
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar list */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 h-fit">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">
              All Checkpoints
            </p>
            <div className="space-y-1">
              {checkpointList.map((cp, i) => {
                const unlocked = isUnlocked(cp._id);
                const active = (id || checkpointList[0]?._id) === cp._id;
                return (
                  <Link
                    key={i}
                    to={unlocked ? `/checkpoint/${cp._id}` : "#"}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${active ? "bg-indigo-600 text-white" : unlocked ? "hover:bg-slate-50 text-slate-700" : "opacity-40 cursor-not-allowed text-slate-400"}`}
                  >
                    <i
                      className={`fas ${unlocked ? "fa-flag-checkered" : "fa-lock"} text-xs flex-shrink-0`}
                    ></i>
                    <span className="font-medium truncate">
                      {cp.skillsName}
                    </span>
                    {unlocked && !active && (
                      <i className="fas fa-chevron-right text-xs ml-auto opacity-40"></i>
                    )}
                  </Link>
                );
              })}
              {checkpointList.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <i className="fas fa-lock text-3xl mb-2 block opacity-20"></i>
                  <p className="text-xs">No checkpoints yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">
            {checkpointContent ? (
              <>
                {/* Content card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h2 className="font-bold text-slate-900 text-lg mb-4">
                    {checkpointContent.title}
                  </h2>
                  {checkpointContent.skillsData?.[0]?.content && (
                    <div
                      className="prose max-w-none text-slate-700 text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: checkpointContent.skillsData[0].content,
                      }}
                    />
                  )}
                </div>

                {/* Submission card */}
                {isUnlocked(checkpointContent._id) && (
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 className="font-bold text-slate-900 mb-4">
                      {isSubmitted()
                        ? "Update Your Submission"
                        : "Submit Your Work"}
                    </h3>
                    {checkpointSubmited?.link && (
                      <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <p className="text-xs font-semibold text-emerald-700 mb-1">
                          Current submission
                        </p>
                        <a
                          href={checkpointSubmited.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-600 text-sm hover:underline break-all"
                        >
                          {checkpointSubmited.link}
                        </a>
                        {checkpointSubmited.score && (
                          <p className="text-xs text-emerald-600 mt-1 font-bold">
                            Score: {checkpointSubmited.score}/10
                          </p>
                        )}
                      </div>
                    )}
                    <div className="flex gap-3">
                      <input
                        type="url"
                        placeholder="https://github.com/your-repo"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                      <button
                        onClick={handleSubmit}
                        disabled={!link || submitLoading}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold px-5 py-3 rounded-xl text-sm transition-all whitespace-nowrap"
                      >
                        {submitLoading
                          ? "Submitting..."
                          : isSubmitted()
                            ? "Update"
                            : "Submit"}
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-16 text-center text-slate-400">
                <i className="fas fa-flag-checkered text-5xl mb-4 block opacity-20"></i>
                <p className="font-semibold">
                  Select a checkpoint to get started
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkpoint;

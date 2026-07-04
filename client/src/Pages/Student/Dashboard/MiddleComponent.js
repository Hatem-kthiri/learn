import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { get_students_progress } from "../../../redux/actions/InstructorActions";
import {
  get_instructor_name,
  get_student_meeting,
} from "../../../redux/actions/StudentAction";

const MiddleComponent = ({ user, userLoading }) => {
  const { studentsProgress } = useSelector((state) => state.instructorReducer);
  const { meetings, instructorName, night_mode } = useSelector(
    (state) => state.StudentReducer,
  );
  const dispatch = useDispatch();
  const dm = night_mode;

  useEffect(() => {
    if (!userLoading && user.course?.[0]?.guild) {
      dispatch(get_students_progress(user.course[0].guild));
      dispatch(get_student_meeting(user.course[0].guild));
      dispatch(get_instructor_name(user.course[0].guild));
    }
  }, [user]);

  const sorted = [...studentsProgress].sort(
    (a, b) =>
      (parseFloat(b.course?.[0]?.learnScore) || 0) -
      (parseFloat(a.course?.[0]?.learnScore) || 0),
  );
  const cardCls = dm
    ? "bg-gray-800 border border-gray-700 rounded-2xl p-6"
    : "bg-white border border-slate-100 rounded-2xl shadow-sm p-6";
  const titleCls = dm ? "text-white font-bold" : "text-slate-900 font-bold";
  const subCls = dm ? "text-gray-400" : "text-slate-400";
  const rowCls = dm
    ? "bg-gray-700 hover:bg-gray-600"
    : "bg-slate-50 hover:bg-indigo-50";
  const progBg = dm ? "bg-gray-600" : "bg-slate-100";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Guild Progress */}
      <div className={cardCls}>
        <div className="flex items-center justify-between mb-5">
          <h2 className={titleCls}>Guild Progress</h2>
          {instructorName && (
            <p className={`text-xs ${subCls}`}>
              Instructor:{" "}
              <span
                className={`font-semibold ${dm ? "text-gray-200" : "text-slate-700"}`}
              >
                {instructorName.firstName}
              </span>
            </p>
          )}
        </div>
        <div className="space-y-3">
          {sorted.length > 0 ? (
            sorted.map((student, i) => (
              <div key={i} className="flex items-center gap-3">
                <img
                  src={student.profileImg}
                  alt=""
                  className="w-9 h-9 rounded-xl object-cover bg-slate-200 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p
                      className={`text-sm font-semibold truncate ${dm ? "text-gray-100" : "text-slate-900"}`}
                    >
                      {student.firstName} {student.lastName}
                    </p>
                    <span className="text-xs font-bold text-indigo-400 flex-shrink-0 ml-2">
                      {student.course?.[0]?.learnScore}
                    </span>
                  </div>
                  <div
                    className={`h-1.5 ${progBg} rounded-full overflow-hidden`}
                  >
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{
                        width: `${student.course?.[0]?.learnProgress || 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <span className={`text-xs flex-shrink-0 ${subCls}`}>
                  {student.course?.[0]?.learnProgress || 0}%
                </span>
              </div>
            ))
          ) : (
            <div className={`text-center py-8 ${subCls}`}>
              <i className="fas fa-users text-4xl mb-2 block opacity-20"></i>
              <p className="text-sm">No guild data</p>
            </div>
          )}
        </div>
      </div>

      {/* Meetings */}
      <div className={cardCls}>
        <h2 className={`${titleCls} mb-5`}>Upcoming Meetings</h2>
        <div className="space-y-3">
          {meetings?.length > 0 ? (
            meetings.map((meeting, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${rowCls}`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${dm ? "bg-indigo-900 text-indigo-400" : "bg-indigo-100 text-indigo-600"}`}
                >
                  <i className="fas fa-video text-sm"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-semibold text-sm truncate ${dm ? "text-gray-100" : "text-slate-900"}`}
                  >
                    {meeting.name}
                  </p>
                  <p className={`text-xs mt-0.5 ${subCls}`}>
                    {meeting.date
                      ? new Date(meeting.date).toLocaleDateString()
                      : ""}
                  </p>
                </div>
                {meeting.link && (
                  <a
                    href={meeting.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors"
                  >
                    Join
                  </a>
                )}
              </div>
            ))
          ) : (
            <div className={`text-center py-8 ${subCls}`}>
              <i className="fas fa-video text-4xl mb-2 block opacity-20"></i>
              <p className="text-sm">No upcoming meetings</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiddleComponent;

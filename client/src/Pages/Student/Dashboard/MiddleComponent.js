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
  const { meetings, instructorName } = useSelector(
    (state) => state.StudentReducer,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userLoading && user.course?.[0]?.guild) {
      dispatch(get_students_progress(user.course[0].guild));
      dispatch(get_student_meeting(user.course[0].guild));
      dispatch(get_instructor_name(user.course[0].guild));
    }
  }, [user]);

  const guildProgress =
    studentsProgress.length > 0
      ? Math.round(
          studentsProgress.reduce(
            (acc, s) => acc + (+s.course?.[0]?.learnProgress || 0),
            0,
          ) / studentsProgress.length,
        )
      : 0;

  const sorted = [...studentsProgress].sort(
    (a, b) =>
      (parseFloat(b.course?.[0]?.learnScore) || 0) -
      (parseFloat(a.course?.[0]?.learnScore) || 0),
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Guild Progress */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-slate-900">Guild Progress</h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
            {guildProgress}% avg
          </span>
        </div>
        <div className="space-y-3">
          {sorted.length > 0 ? (
            sorted.map((student, i) => (
              <div key={i} className="flex items-center gap-3">
                <img
                  src={student.profileImg}
                  alt=""
                  className="w-9 h-9 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {student.firstName} {student.lastName}
                    </p>
                    <span className="text-xs font-bold text-indigo-600 flex-shrink-0 ml-2">
                      {student.course?.[0]?.learnScore}
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{
                        width: `${student.course?.[0]?.learnProgress || 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0">
                  {student.course?.[0]?.learnProgress || 0}%
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-300">
              <i className="fas fa-users text-4xl mb-2 block"></i>
              <p className="text-sm">No guild data</p>
            </div>
          )}
        </div>
      </div>

      {/* Meetings */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-slate-900">Upcoming Meetings</h2>
          {instructorName && (
            <p className="text-xs text-slate-500">
              Instructor:{" "}
              <span className="font-semibold text-slate-700">
                {`${instructorName.firstName} ${instructorName.lastName}`}
              </span>
            </p>
          )}
        </div>
        <div className="space-y-3">
          {meetings?.length > 0 ? (
            meetings.map((meeting, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-indigo-50 transition-colors group"
              >
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-200 transition-colors">
                  <i className="fas fa-video text-sm"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm truncate">
                    {meeting.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
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
            <div className="text-center py-8 text-slate-300">
              <i className="fas fa-video text-4xl mb-2 block"></i>
              <p className="text-sm">No upcoming meetings</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiddleComponent;

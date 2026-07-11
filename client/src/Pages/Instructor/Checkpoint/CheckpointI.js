import React, { useEffect } from "react";
import HeaderI from "../../../Components/Header/HeaderI";
import { current } from "../../../redux/actions/Actions";
import { useDispatch, useSelector } from "react-redux";
import { get_checkpoints } from "../../../redux/actions/InstructorActions";
import { Link } from "react-router-dom";
import Footer from "../../../Components/Footer/Footer";

const CheckpointI = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.LoginReducer);
  const { studentsCheckpoints } = useSelector(
    (state) => state.instructorReducer,
  );

  useEffect(() => {
    dispatch(current());
  }, []);
  useEffect(() => {
    dispatch(get_checkpoints(user));
  }, [user]);

  const pending = studentsCheckpoints.filter(
    (s) => s.student !== null && s.open === true,
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      <HeaderI />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Checkpoints</h1>
            <p className="text-slate-500 text-sm mt-1 dark:text-gray-400">
              {pending.length} pending validation
            </p>
          </div>
          {pending.length > 0 && (
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold bg-amber-100 text-amber-700">
              <i className="fas fa-clock mr-1.5 text-xs"></i> {pending.length}{" "}
              pending
            </span>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 dark:bg-gray-800 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 dark:bg-gray-900 dark:border-gray-700">
                  {[
                    "",
                    "Student",
                    "Checkpoint",
                    "Course",
                    "Guild",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-gray-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-gray-700">
                {pending.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors dark:hover:bg-gray-700">
                    <td className="px-4 py-4">
                      <img
                        src={item.student?.profileImg}
                        alt=""
                        className="w-9 h-9 rounded-xl object-cover bg-slate-100 dark:bg-gray-700"
                      />
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-900 dark:text-white">
                      {item.student?.firstName} {item.student?.lastName}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                        {item.checkpointName}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-500 text-xs dark:text-gray-400">
                      {item.student?.course?.[0]?.course?.title}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                        {item.student?.course?.[0]?.guild}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        to={`/checkpoint-validate/${item._id}`}
                        className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl text-xs transition-colors"
                      >
                        <i className="fas fa-check-circle text-xs"></i> Validate
                      </Link>
                    </td>
                  </tr>
                ))}
                {pending.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-16 text-slate-400 dark:text-gray-500"
                    >
                      <i className="fas fa-flag-checkered text-4xl mb-3 block opacity-20"></i>
                      <p className="font-medium">No pending checkpoints</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckpointI;

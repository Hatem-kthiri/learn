import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import ClipLoader from "react-spinners/ClipLoader";

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState();
  const [step, setStep] = useState(2);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/api/admin/getCourse/${id}`).then((r) => setCourse(r.data.course)).catch(console.log);
  }, [id]);

  const handleChange = (e) => setCourse({ ...course, [e.target.name]: e.target.value });

  const GoToNextStep = async () => {
    if (step === 2) {
      setLoading(true);
      await api.put(`/api/admin/updatedCourseName/${id}`, { course }).catch(console.log);
      setLoading(false);
    }
    if (step < 4) setStep(step + 1);
    else navigate("/mycourse");
  };

  const steps = [
    { num: 2, label: "Course Info", icon: "fas fa-info-circle" },
    { num: 3, label: "Curriculum", icon: "fas fa-list-ul" },
    { num: 4, label: "Publish", icon: "fas fa-rocket" },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate("/mycourse")} className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 transition-colors">
          <i className="fas fa-arrow-left text-sm"></i>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Course</h1>
          <p className="text-slate-500 text-sm mt-0.5 truncate max-w-md">{course?.title}</p>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-0 mb-8 max-w-lg">
        {steps.map((s, i) => (
          <React.Fragment key={s.num}>
            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${step === s.num ? "bg-indigo-600 text-white shadow-sm" : step > s.num ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"}`}
              onClick={() => step > s.num && setStep(s.num)}>
              <i className={`${step > s.num ? "fas fa-check" : s.icon} text-xs`}></i>
              <span>{s.label}</span>
            </div>
            {i < steps.length - 1 && <div className={`h-0.5 flex-1 mx-1 ${step > s.num ? "bg-emerald-300" : "bg-slate-200"}`}></div>}
          </React.Fragment>
        ))}
      </div>

      <div className="max-w-3xl">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
          {step === 2 && <Step1 getCourseValue={handleChange} course={course} />}
          {step === 3 && <Step2 course={course} setCourse={setCourse} />}
          {step === 4 && <Step3 />}

          <div className="flex gap-3 mt-7 pt-6 border-t border-slate-100">
            {step > 2 && (
              <button onClick={() => setStep(step - 1)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-sm transition-all inline-flex items-center justify-center gap-2">
                <i className="fas fa-arrow-left text-xs"></i> Back
              </button>
            )}
            <button onClick={GoToNextStep} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-sm transition-all inline-flex items-center justify-center gap-2">
              {loading ? <ClipLoader color="#fff" size={18} /> : (
                step === 4 ? <><i className="fas fa-check text-xs"></i> Done</> : <><span>Next</span> <i className="fas fa-arrow-right text-xs"></i></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;

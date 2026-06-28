import React, { useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import api from "../../../utils/api";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

const CreateCourse = () => {
  const [step, setStep] = useState(1);
  const [courseCreated, setCourseCreated] = useState(null);
  const [course, setCourse] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const formData = new FormData();

  const handleChange = (e) => { e.preventDefault(); setCourse({ ...course, [e.target.name]: e.target.value }); };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    formData.append("image", file);
    formData.append("title", course.title);
    formData.append("description", course.description);
  };

  const NextStep = async () => {
    if (step === 1) {
      setLoading(true);
      try {
        if (!courseCreated) {
          const result = await api.post("/api/admin/createCourse", formData);
          setCourseCreated(result.data.course);
          if (result.data.course) { navigate("/mycourse"); return; }
        } else {
          const result = await api.put(`/api/admin/updatedCourseName/${courseCreated._id}`, { course });
          setCourseCreated(result.data.course);
        }
        setStep(2);
      } catch (e) { console.log(e); } finally { setLoading(false); }
    } else {
      setStep(step + 1);
    }
  };

  const steps = [
    { num: 1, label: "Basic Info", icon: "fas fa-info-circle" },
    { num: 2, label: "Curriculum", icon: "fas fa-list-ul" },
    { num: 3, label: "Publish", icon: "fas fa-rocket" },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 transition-colors">
          <i className="fas fa-arrow-left text-sm"></i>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create Course</h1>
          <p className="text-slate-500 text-sm mt-0.5">Step {step} of {steps.length}</p>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-0 mb-8 max-w-lg">
        {steps.map((s, i) => (
          <React.Fragment key={s.num}>
            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${step === s.num ? "bg-indigo-600 text-white shadow-sm" : step > s.num ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
              <i className={`${step > s.num ? "fas fa-check" : s.icon} text-xs`}></i>
              <span>{s.label}</span>
            </div>
            {i < steps.length - 1 && <div className={`h-0.5 flex-1 mx-1 ${step > s.num ? "bg-emerald-300" : "bg-slate-200"}`}></div>}
          </React.Fragment>
        ))}
      </div>

      <div className="max-w-2xl">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
          {step === 1 && <Step1 getCourseValue={handleChange} handleImageUpload={handleImageUpload} />}
          {step === 2 && <Step2 courseCreated={courseCreated} />}
          {step === 3 && <Step3 courseCreated={courseCreated} />}

          <div className="flex gap-3 mt-7 pt-6 border-t border-slate-100">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-sm transition-all inline-flex items-center justify-center gap-2">
                <i className="fas fa-arrow-left text-xs"></i> Back
              </button>
            )}
            <button onClick={NextStep} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-sm transition-all inline-flex items-center justify-center gap-2">
              {loading ? <ClipLoader color="#fff" size={18} /> : (
                <>{step === steps.length ? <><i className="fas fa-rocket text-xs"></i> Publish</> : <><span>Next</span> <i className="fas fa-arrow-right text-xs"></i></>}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import dragImage from "../../../Assets/images/handleDrag.svg";
import axios from "axios";
import { url } from "../../../utils";
import ClipLoader from "react-spinners/ClipLoader";

const QuizTypeTwo = ({ skillsData, handleNext, setNextButton, user, setWait }) => {
  const { skillsId } = useParams();
  const [showAnswer, setShowAnswer] = useState(false);
  const [rangeData, setRangeData] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [calculatePercentage, setCalculatePercentage] = useState(0);
  const [quizAlreadySubmitted, setQuizAlreadySubmitted] = useState(undefined);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${url}/api/user/get-quiz/${user._id}/${skillsId}`)
      .then((res) => { setQuizAlreadySubmitted(res.data.data); setLoading(false); setWait(false); setNextButton(true); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const shuffled = [...skillsData.statements].sort(() => Math.random() - 0.5);
    setRangeData(shuffled);
  }, []);

  const handleDrop = (e, index) => {
    e.preventDefault();
    const dragged = JSON.parse(e.dataTransfer.getData("text/plain"));
    const updated = [...rangeData];
    const fromIdx = updated.findIndex((i) => i.text === dragged.text);
    updated.splice(fromIdx, 1);
    updated.splice(index, 0, dragged);
    setRangeData(updated);
  };

  const handleSubmit = () => {
    setSubmitLoading(true);
    setIsSubmitted(true);
    let correct = 0;
    for (let i = 0; i < skillsData.statements.length; i++) {
      if (rangeData[i]?.text === skillsData.statements[i].text) correct++;
    }
    const score = (correct * 100) / skillsData.statements.length;
    setCalculatePercentage(score);
    axios.post(`${url}/api/user/add-Quiz-Score/${user._id}`, {
      quizScore: score, quizId: skillsId,
      response: { assessmentType: 2, quizResponse: rangeData },
    }).then(() => { setShowResults(true); setNextButton(true); setSubmitLoading(false); });
  };

  const DragItem = ({ item, index, correct }) => (
    <div
      onDrop={(e) => handleDrop(e, index)}
      onDragOver={(e) => e.preventDefault()}
      draggable={!isSubmitted}
      onDragStart={(e) => e.dataTransfer.setData("text/plain", JSON.stringify(item))}
      className={`flex items-center justify-between gap-3 p-3.5 mb-2 rounded-xl border text-sm font-medium select-none transition-all
        ${correct === true ? "bg-emerald-50 border-emerald-300 text-emerald-800" :
          correct === false ? "bg-red-50 border-red-300 text-red-800" :
          "bg-white border-slate-200 hover:border-indigo-300 text-slate-800 cursor-grab active:cursor-grabbing"}`}>
      <span className="flex-1">{item.text}</span>
      <img src={dragImage} alt="drag" className="w-4 h-4 opacity-40 flex-shrink-0" />
    </div>
  );

  // ── Already submitted / results view ──────────────────────────────────
  if (showResults || quizAlreadySubmitted !== undefined) {
    return (
      <div>
        {/* Score card */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-6 text-white text-center mb-6">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <i className="fas fa-trophy text-2xl"></i>
          </div>
          <p className="text-indigo-200 text-sm font-medium mb-1">Your Score</p>
          <p className="text-5xl font-black">
            {quizAlreadySubmitted !== undefined ? quizAlreadySubmitted.quizScore : Math.round(calculatePercentage)}
            <span className="text-2xl font-bold text-indigo-300">%</span>
          </p>
        </div>

        {/* Answer review (toggle) */}
        {showAnswer && (
          <div className="mb-5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              {quizAlreadySubmitted ? "Your answers" : "Current order"}
            </p>
            <div>
              {(quizAlreadySubmitted?.response?.quizResponse ?? rangeData).map((item, i) => {
                const isCorrect = item.text === skillsData.statements[i]?.text;
                return <DragItem key={i} item={item} index={i} correct={isCorrect} />;
              })}
            </div>
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mt-5 mb-3">Correct order</p>
            <div>
              {skillsData.statements.map((item, i) => (
                <DragItem key={i} item={item} index={i} correct={true} />
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-4">
          <button onClick={handleNext}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
            <i className="fas fa-arrow-right text-xs"></i> Next
          </button>
          <button onClick={() => setShowAnswer(!showAnswer)}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
            <i className={`fas ${showAnswer ? "fa-eye-slash" : "fa-eye"} text-xs`}></i>
            {showAnswer ? "Hide" : "Show"} Answers
          </button>
        </div>
      </div>
    );
  }

  // ── Quiz in progress ──────────────────────────────────────────────────
  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <i className="fas fa-sort text-violet-600"></i>
        </div>
        <div>
          <p className="font-bold text-slate-900">Drag & Drop Ordering</p>
          <p className="text-xs text-slate-500 mt-0.5">Arrange the items in the correct order</p>
        </div>
      </div>

      {skillsData.questions && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mb-4 text-sm text-amber-900 font-medium">
          <i className="fas fa-info-circle mr-2"></i>{skillsData.questions}
        </div>
      )}

      <div className="mb-5">
        {rangeData.map((item, index) => (
          <DragItem key={index} item={item} index={index} correct={undefined} />
        ))}
      </div>

      <button onClick={handleSubmit} disabled={isSubmitted}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
        {submitLoading ? <ClipLoader color="#fff" size={18} /> : <><i className="fas fa-paper-plane text-xs"></i> Submit</>}
      </button>
    </div>
  );
};

export default QuizTypeTwo;

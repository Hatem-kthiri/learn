import axios from "axios";
import React, { useEffect, useState } from "react";
import { url } from "../../../utils";
import ClipLoader from "react-spinners/ClipLoader";

const QuizTypeOne = ({ skillsData, handleNext, setNextButton, user, skillsId, setWait }) => {
  const [quizAlreadySubmitted, setQuizAlreadySubmitted] = useState(undefined);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

  const { blankItems, correctElements, elements } = skillsData;
  const [droppedItems, setDroppedItems] = useState([...elements]);
  const [remainingItems, setRemainingItems] = useState([...blankItems]);

  useEffect(() => {
    axios.get(`${url}/api/user/get-quiz/${user._id}/${skillsId}`)
      .then((res) => { setQuizAlreadySubmitted(res.data.data); setWait(false); setNextButton(true); })
      .catch(() => {});
  }, []);

  const handleDragStart = (e, index) => {
    setDraggedItem({ ...remainingItems[index], originalIndex: index });
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (draggedItem?.originalIndex === index) return;
    const updated = [...droppedItems];
    updated[index] = draggedItem;
    if (droppedItems[index].text === "") {
      setDroppedItems(updated);
      setRemainingItems(remainingItems.filter((item) => item.text !== draggedItem.text));
    }
  };

  const handleItemClick = (item) => {
    if (item.originalIndex >= 0) {
      setDroppedItems(droppedItems.map((el) => (el.text === item.text ? { text: "" } : el)));
      setRemainingItems([...remainingItems, { text: item.text }]);
    }
  };

  const calculatePercentage = () => {
    let correct = 0;
    for (let i = 0; i < droppedItems.length; i++) {
      if (droppedItems[i].originalIndex !== undefined && droppedItems[i].text === correctElements[i]?.text) correct++;
    }
    return Math.round((correct / blankItems.length) * 100);
  };

  const handleSubmit = () => {
    setSubmitLoading(true);
    axios.post(`${url}/api/user/add-Quiz-Score/${user._id}`, {
      quizScore: calculatePercentage(), quizId: skillsId,
      response: { assessmentType: 1, quizResponse: droppedItems },
    }).then((res) => { setQuizAlreadySubmitted(res.data.data); setShowResults(true); setNextButton(true); setSubmitLoading(false); });
  };

  // ── Results / already submitted ───────────────────────────────────────
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
            {quizAlreadySubmitted !== undefined ? quizAlreadySubmitted.quizScore : calculatePercentage()}
            <span className="text-2xl font-bold text-indigo-300">%</span>
          </p>
        </div>

        {/* Answer review */}
        {showAnswer && (
          <div className="mb-5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Your Answers</p>
            <div className="flex flex-wrap gap-1.5 p-4 bg-slate-50 border border-slate-200 rounded-xl min-h-12 mb-4">
              {(quizAlreadySubmitted?.response?.quizResponse ?? droppedItems).map((item, i) => {
                const submitted = quizAlreadySubmitted?.response?.quizResponse;
                const isCorrect = submitted ? item.text === skillsData.correctElements[i]?.text : null;
                return (
                  <span key={i} className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                    ${item.text === "" ? "bg-emerald-100 border-2 border-dashed border-emerald-300 w-28 min-h-8" :
                      isCorrect === true ? "bg-emerald-100 text-emerald-800 border border-emerald-300" :
                      isCorrect === false ? "bg-red-100 text-red-800 border border-red-300" :
                      "bg-indigo-100 text-indigo-800 border border-indigo-200"}`}>
                    {item.text}
                  </span>
                );
              })}
            </div>
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3">Correct Answer</p>
            <div className="flex flex-wrap gap-1.5 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              {correctElements.map((item, i) => (
                <span key={i} className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {item.text}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
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
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <i className="fas fa-puzzle-piece text-indigo-600"></i>
        </div>
        <div>
          <p className="font-bold text-slate-900">Fill in the Blanks</p>
          <p className="text-xs text-slate-500 mt-0.5">Drag words from below into the correct blanks</p>
        </div>
      </div>

      {/* Drop zone — sentence with blanks */}
      <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl flex flex-wrap gap-1.5 min-h-16 mb-5 items-center">
        {droppedItems.map((item, index) => (
          <span key={index}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, index)}
            onClick={() => handleItemClick(item)}
            className={`inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-semibold border-2 cursor-pointer select-none transition-all
              ${item.text === "" ? "w-28 h-9 border-dashed border-indigo-300 bg-indigo-50" :
                "border-indigo-400 bg-indigo-100 text-indigo-800 hover:bg-red-50 hover:border-red-300 hover:text-red-700"}`}>
            {item.text}
          </span>
        ))}
      </div>

      {/* Draggable word bank */}
      <div className="mb-5">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Word Bank — drag to blanks</p>
        <div className="flex flex-wrap gap-2 p-4 bg-white border border-slate-200 rounded-2xl min-h-12">
          {remainingItems.map((item, index) => (
            <span key={index} draggable onDragStart={(e) => handleDragStart(e, index)}
              className="inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-semibold bg-violet-100 text-violet-800 border-2 border-violet-200 cursor-grab active:cursor-grabbing hover:bg-violet-200 hover:border-violet-300 transition-all select-none">
              {item.text}
            </span>
          ))}
          {remainingItems.length === 0 && (
            <p className="text-xs text-slate-400 italic self-center">All words placed</p>
          )}
        </div>
      </div>

      <button onClick={handleSubmit} disabled={remainingItems.length > 0}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
        {submitLoading ? <ClipLoader color="#fff" size={18} /> : <><i className="fas fa-paper-plane text-xs"></i> Submit</>}
      </button>
    </div>
  );
};

export default QuizTypeOne;

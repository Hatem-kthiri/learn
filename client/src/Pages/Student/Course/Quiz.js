import React, { useEffect, useState } from "react";
import QuizTypeOne from "./QuizTypeOne";
import QuizTypeTwo from "./QuizTypeTwo";
import axios from "axios";
import { url } from "../../../utils";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import AceEditor from "react-ace";
import ClipLoader from "react-spinners/ClipLoader";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";

const Quiz = ({ skillsData, handleNext, setNextButton }) => {
  const { skillsId } = useParams();
  const { user } = useSelector((state) => state.LoginReducer);
  const [loading, setLoading] = useState(true);
  const [choicesState, setChoicesState] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [quizAlreadySubmitted, setQuizAlreadySubmitted] = useState(undefined);
  const [wait, setWait] = useState(true);

  const imageLinkRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/i;

  useEffect(() => {
    setWait(true);
    setQuizAlreadySubmitted(undefined);
    setNextButton(false);
    axios.get(`${url}/api/user/get-quiz/${user._id}/${skillsId}`)
      .then((r) => { setQuizAlreadySubmitted(r.data.data); setNextButton(true); })
      // A 404 here just means "not submitted yet" - the normal first-view case,
      // not an error. Either way, stop waiting so the quiz UI can render.
      .catch(() => {})
      .finally(() => setWait(false));
  }, [skillsId]);

  useEffect(() => {
    if (skillsData?.questions) {
      setChoicesState(skillsData.questions.map((q) => q.choices.map(() => false)));
      setLoading(false);
    }
  }, [skillsData]);

  const handleChoiceChange = (qi, ci) => {
    const updated = choicesState.map((q, i) => i === qi ? q.map((c, j) => j === ci ? !c : c) : q);
    setChoicesState(updated);
  };

  const calculateScore = () => {
    let correct = 0;
    skillsData.questions.forEach((q, qi) => {
      const isFullyCorrect = q.choices.every(
        (c, ci) => Boolean(choicesState[qi]?.[ci]) === c.isCorrect
      );
      if (isFullyCorrect) correct++;
    });
    return Math.round((correct / skillsData.questions.length) * 100);
  };

  const handleSubmit = () => {
    setSubmitLoading(true);
    const quizResponse = skillsData.questions.map((q, i) => ({
      question: q.question,
      choices: q.choices.map((c, j) => ({ ...c, selected: choicesState[i][j] })),
    }));
    // Matches the same endpoint/shape used by QuizTypeOne/QuizTypeTwo.
    axios
      .post(`${url}/api/user/add-Quiz-Score/${user._id}`, {
        quizScore: calculateScore(),
        quizId: skillsId,
        response: { assessmentType: 0, quizResponse },
      })
      .then((res) => {
        setQuizAlreadySubmitted(res.data.data);
        setSubmitted(true);
        setShowAnswer(true);
        setNextButton(true);
        setSubmitLoading(false);
      })
      .catch(() => setSubmitLoading(false));
  };

  if (!skillsData) return <div className="flex justify-center py-12"><ClipLoader color="#4f46e5" size={32} /></div>;
  if (wait) return <div className="flex justify-center py-12"><ClipLoader color="#4f46e5" size={32} /></div>;

  if (skillsData.assessmentType == 1) return <QuizTypeOne skillsData={skillsData} handleNext={handleNext} setNextButton={setNextButton} skillsId={skillsId} user={user} setWait={setWait} />;
  if (skillsData.assessmentType == 2) return <QuizTypeTwo skillsData={skillsData} handleNext={handleNext} setNextButton={setNextButton} skillsId={skillsId} user={user} setWait={setWait} />;

  if (quizAlreadySubmitted) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0"><i className="fas fa-check-circle text-emerald-600"></i></div>
          <div><p className="font-bold text-slate-900">Quiz Completed!</p><p className="text-sm text-emerald-600">Score: {quizAlreadySubmitted.quizScore}%</p></div>
        </div>
        <div className="space-y-5">
          {skillsData.questions?.map((q, qi) => (
            <div key={qi} className="border border-slate-200 rounded-2xl p-5">
              <div className="flex items-start gap-2 mb-4">
                <span className="flex-shrink-0 w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-500">{qi + 1}</span>
                <p className="font-semibold text-slate-900 text-sm">{q.question}</p>
              </div>
              <div className="space-y-2 ml-9">
                {q.choices?.map((c, ci) => (
                  <div key={ci} className={`flex items-center gap-3 p-3 rounded-xl border ${c.isCorrect ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-100"}`}>
                    <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${c.isCorrect ? "bg-emerald-500" : "bg-slate-200"}`}>
                      {c.isCorrect && <i className="fas fa-check text-white text-xs"></i>}
                    </div>
                    <span className="text-sm text-slate-700">{c.text}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0"><i className="fas fa-question-circle text-violet-600"></i></div>
        <div><p className="font-bold text-slate-900">Quiz</p><p className="text-sm text-slate-500">{skillsData.questions?.length} questions</p></div>
      </div>

      {loading ? <div className="flex justify-center py-12"><ClipLoader color="#4f46e5" size={32} /></div> : (
        <div className="space-y-6">
          {skillsData.questions?.map((quiz, qi) => (
            <div key={qi} className="border border-slate-200 rounded-2xl p-5">
              <div className="flex items-start gap-2 mb-4">
                <span className="flex-shrink-0 w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center text-xs font-bold text-indigo-600">{qi + 1}</span>
                <p className="font-semibold text-slate-900 text-sm">{quiz.question}</p>
              </div>
              {quiz.code && (
                <div className="ml-9 mb-4 rounded-xl overflow-hidden">
                  <AceEditor mode="javascript" theme="monokai" value={quiz.code} readOnly={true} editorProps={{ $blockScrolling: true }} setOptions={{ useWorker: false }} style={{ width: "100%", height: "150px" }} />
                </div>
              )}
              <div className="space-y-2 ml-9">
                {quiz.choices?.map((choice, ci) => {
                  const isChecked = choicesState[qi]?.[ci];
                  return (
                    <button key={ci} onClick={() => handleChoiceChange(qi, ci)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${isChecked ? "bg-indigo-50 border-indigo-300" : "bg-slate-50 border-slate-100 hover:border-slate-300"}`}>
                      <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-all ${isChecked ? "bg-indigo-600 border-indigo-600" : "border-slate-300"}`}>
                        {isChecked && <i className="fas fa-check text-white text-xs"></i>}
                      </div>
                      {imageLinkRegex.test(choice.text)
                        ? <img src={choice.text} alt="choice" className="max-h-16 rounded" />
                        : <span className="text-sm text-slate-700">{choice.text}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <button onClick={handleSubmit} disabled={submitLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-bold py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
            {submitLoading ? <ClipLoader color="#fff" size={18} /> : <><i className="fas fa-paper-plane"></i> Submit Quiz</>}
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;

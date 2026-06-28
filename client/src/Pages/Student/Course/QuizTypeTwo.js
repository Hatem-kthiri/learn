import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import dragImage from "../../../Assets/images/handleDrag.svg";
import axios from "axios";
import { url } from "../../../utils";
import ClipLoader from "react-spinners/ClipLoader";
import { Link } from "react-router-dom";

const QuizTypeTwo = ({
  skillsData,
  handleNext,
  setNextButton,
  user,
  setWait,
}) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rangeData, setRangeData] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [calculatePercentage, setCalculatePercentage] = useState(0);
  const [quizAlreadySubmitted, setQuizAlreadySubmitted] = useState(undefined);
  useEffect(() => {
    axios
      .get(`${url}/api/user/get-quiz/${user._id}/${skillsId}`)
      .then((res) => {
        setQuizAlreadySubmitted(res.data.data);
        setLoading(false);
        setWait(false);
        setNextButton(true);
      })
      .catch((err) => {});
  }, []);
  useEffect(() => {
    shuffleData();
  }, []);

  const shuffleData = () => {
    const shuffledData = [...skillsData.statements].sort(
      () => Math.random() - 0.5
    );
    setData(shuffledData);
    setRangeData([...shuffledData]);
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    const draggedItem = JSON.parse(e.dataTransfer.getData("text/plain"));
    const updatedData = [...rangeData];
    const draggedItemIndex = updatedData.findIndex(
      (item) => item.text === draggedItem.text
    );

    updatedData.splice(draggedItemIndex, 1); // Remove the dragged item from its original position
    updatedData.splice(index, 0, draggedItem); // Insert the dragged item at the new position

    setRangeData(updatedData);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const { skillsId } = useParams();
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleSubmit = () => {
    setSubmitLoading(true);

    setIsSubmitted(true);
    let correctPlacements = 0;

    for (let i = 0; i < skillsData.statements.length; i++) {
      if (rangeData[i].text == skillsData.statements[i].text) {
        correctPlacements++;
      }
    }
    let score = (correctPlacements * 100) / skillsData.statements.length;
    setCalculatePercentage(score);

    axios
      .post(`${url}/api/user/add-Quiz-Score/${user._id}`, {
        quizScore: score,
        quizId: skillsId,
        response: { assessmentType: 2, quizResponse: rangeData },
      })
      .then((res) => {
        setShowResults(true);
        setLoading(true);
        setNextButton(true);
        setSubmitLoading(false);
      });
  };
  return (
    <div className="items">
      {showResults || quizAlreadySubmitted !== undefined ? (
        <div className="assessment-result">
          {showAnswer ? (
            quizAlreadySubmitted !== undefined && !loading ? (
              <div className="drag-result">
                <p>{skillsData.questions}</p>
                {quizAlreadySubmitted.response !== undefined ? (
                  quizAlreadySubmitted.response.quizResponse.map(
                    (item, index) => {
                      return (
                        <div
                          key={index}
                          className={
                            item.text === skillsData.statements[index].text
                              ? "dragItem correct"
                              : "dragItem wrong"
                          }
                          draggable={!isSubmitted}
                        >
                          <p>{item.text}</p>
                          <img src={dragImage} alt="drag" />
                        </div>
                      );
                    }
                  )
                ) : (
                  <></>
                )}
                <h3>Solution.</h3>
                <p>{skillsData.questions}</p>
                {skillsData.statements.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="dragItem correct"
                      draggable={!isSubmitted}
                    >
                      <p>{item.text}</p>
                      <img src={dragImage} alt="drag" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <>
                <ClipLoader color="#ffffff" size={20} />
                <div className="drag-result">
                  <h3>Solution.</h3>
                  <p>{skillsData.questions}</p>
                  {skillsData.statements.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="dragItem correct"
                        draggable={!isSubmitted}
                      >
                        <p>{item.text}</p>
                        <img src={dragImage} alt="drag" />
                      </div>
                    );
                  })}
                </div>
              </>
            )
          ) : (
            <>
              <img
                src={require("../../Assets/images/assesmentResult.png")}
                alt="assesment-image"
              />
              <h1>
                Your Score:{" "}
                <span>
                  {quizAlreadySubmitted !== undefined
                    ? quizAlreadySubmitted.quizScore
                    : calculatePercentage}{" "}
                  %
                </span>
              </h1>
            </>
          )}
          <div className="btn_block">
            <Link className="view_btn" onClick={() => handleNext()}>
              Next
            </Link>

            <Link
              className="view_btn"
              onClick={() => setShowAnswer(!showAnswer)}
            >
              {!showAnswer ? "Correct" : "Hide"} Answer
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <p>{skillsData.questions}</p>
          {rangeData.map((item, index) => (
            <div
              key={index}
              onDrop={(e) => handleDrop(e, index)}
              onDragOver={handleDragOver}
              className="dragItem"
              draggable={!isSubmitted}
              onDragStart={(e) =>
                e.dataTransfer.setData("text/plain", JSON.stringify(item))
              }
            >
              <p>{item.text}</p>
              <img src={dragImage} alt="drag" />
            </div>
          ))}
          <div className="btn-quiz">
            <button
              onClick={handleSubmit}
              disabled={isSubmitted}
              className="submit-quiz"
            >
              {submitLoading ? (
                <ClipLoader color="#ffffff" size={20} />
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizTypeTwo;

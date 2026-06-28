import axios from "axios";
import React, { useEffect, useState } from "react";
import { url } from "../../../utils";
import ClipLoader from "react-spinners/ClipLoader";
import { Link } from "react-router-dom";
const QuizTypeOne = ({
  skillsData,
  handleNext,
  setNextButton,
  user,
  skillsId,
  setWait,
}) => {
  const [quizAlreadySubmitted, setQuizAlreadySubmitted] = useState(undefined);
  useEffect(() => {
    axios
      .get(`${url}/api/user/get-quiz/${user._id}/${skillsId}`)
      .then((res) => {
        setQuizAlreadySubmitted(res.data.data);
        setWait(false);
        setNextButton(true);
      })
      .catch((err) => console.clear());
  }, []);
  const [showAnswer, setShowAnswer] = useState(false);

  const { blankItems, correctElements, elements } = skillsData;
  const [draggedItem, setDraggedItem] = useState(null);
  const [droppedItems, setDroppedItems] = useState([...elements]);
  const [remainingItems, setRemainingItems] = useState([...blankItems]);
  const [showResults, setShowResults] = useState(false);

  const handleDragStart = (e, index) => {
    setDraggedItem({ ...remainingItems[index], originalIndex: index });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, index) => {
    e.preventDefault();

    if (draggedItem.originalIndex === index) return;

    const updatedDroppedItems = [...droppedItems];
    updatedDroppedItems[index] = draggedItem;

    if (droppedItems[index].text == "") {
      setDroppedItems(updatedDroppedItems);
      const updatedRemainingItems = remainingItems.filter(
        (item) => item.text !== draggedItem.text
      );
      setRemainingItems(updatedRemainingItems);
    }
  };

  const handleItemClick = (item) => {
    if (item.originalIndex >= 0) {
      var updatedDroppedItems = droppedItems.map((el) =>
        el.text === item.text ? { text: "" } : el
      );
      setDroppedItems(updatedDroppedItems);
      remainingItems.push({ text: item.text });
    }
  };

  const calculatePercentage = () => {
    let correctCount = 0;
    for (let i = 0; i < droppedItems.length; i++) {
      if (
        droppedItems[i].originalIndex !== undefined &&
        droppedItems[i].text === correctElements[i].text
      ) {
        correctCount++;
      }
    }

    const totalBlankItems = blankItems.length;
    let score = Math.round((correctCount / totalBlankItems) * 100);
    return score;
  };
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleSubmit = () => {
    setSubmitLoading(true);

    axios
      .post(`${url}/api/user/add-Quiz-Score/${user._id}`, {
        quizScore: calculatePercentage(),
        quizId: skillsId,
        response: { assessmentType: 1, quizResponse: droppedItems },
      })
      .then((res) => {
        setQuizAlreadySubmitted(res.data.data);
        setShowResults(true);
        setNextButton(true);
        setSubmitLoading(false);
      });
  };

  return (
    <>
      <div>
        {showResults || quizAlreadySubmitted !== undefined ? (
          <div className="assessment-result">
            {showAnswer ? (
              <>
                <div className="assessment-elements">
                  {quizAlreadySubmitted !== undefined &&
                    quizAlreadySubmitted.response !== undefined &&
                    quizAlreadySubmitted.response.quizResponse.map(
                      (item, index) => {
                        return (
                          <span
                            key={index}
                            className={
                              !item.hasOwnProperty("originalIndex")
                                ? "no-bg"
                                : ""
                            }
                            style={{
                              display: item.text == "" ? "inline-block" : "",
                              backgroundColor:
                                item.text ===
                                skillsData.correctElements[index].text
                                  ? "green"
                                  : "red",

                              width: item.text == "" ? "150px" : "none",
                              height: item.text == "" ? "30px" : "none",
                              textAlign: item.text == "" ? "center" : "none",
                              transform:
                                item.text == "" ? "translateY(10px)" : "none",
                              padding: item.originalIndex >= 0 ? "10px" : "0px",
                              margin: item.originalIndex >= 0 ? "5px" : "0px",
                              color: item.text == "" ? "#000" : "",
                              marginRight: item.text == "" ? "5px" : "3px",
                            }}
                          >
                            {item.text}
                          </span>
                        );
                      }
                    )}
                </div>
                <div className="assessment-elements">
                  <h3>Solution</h3>
                  {skillsData.correctElements.map((item, index) => {
                    return (
                      <span
                        key={index}
                        style={{
                          display: item.text == "" ? "inline-block" : "",

                          width: item.text == "" ? "150px" : "none",
                          height: item.text == "" ? "30px" : "none",
                          textAlign: item.text == "" ? "center" : "none",
                          transform:
                            item.text == "" ? "translateY(10px)" : "none",
                          padding: item.originalIndex >= 0 ? "10px" : "0px",
                          margin: item.originalIndex >= 0 ? "5px" : "0px",
                          color: item.text == "" ? "#000" : "",
                          marginRight: item.text == "" ? "5px" : "3px",
                        }}
                      >
                        {item.text}
                      </span>
                    );
                  })}
                </div>
              </>
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
                      : calculatePercentage()}{" "}
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
          <>
            <div className="quiz-exercice">
              <div className="assessment-elements">
                {droppedItems.map((item, index) => (
                  <span
                    key={index}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    onClick={() => handleItemClick(item)}
                    style={{
                      display: item.text == "" ? "inline-block" : "",
                      backgroundColor:
                        item.text == "" ? "rgb(35, 208, 125)" : "none",
                      width: item.text == "" ? "150px" : "none",
                      height: item.text == "" ? "30px" : "none",
                      textAlign: item.text == "" ? "center" : "none",
                      transform: item.text == "" ? "translateY(10px)" : "none",
                      padding: item.originalIndex >= 0 ? "10px" : "0px",
                      margin: item.originalIndex >= 0 ? "5px" : "0px",
                      color: item.text == "" ? "#000" : "",
                      marginRight: item.text == "" ? "5px" : "3px",
                    }}
                  >
                    {item.text}
                  </span>
                ))}
              </div>
              <div>
                {remainingItems.map((item, index) => (
                  <span
                    key={index}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    style={{
                      display: "inline-block",
                      backgroundColor: "lightblue",
                      padding: "5px",
                      margin: "5px",
                      cursor: "move",
                    }}
                  >
                    {item.text}
                  </span>
                ))}
              </div>
            </div>
            <Link className="view_btn type_btn" onClick={handleSubmit}>
              {submitLoading ? (
                <ClipLoader color="#ffffff" size={20} />
              ) : (
                "Submit"
              )}
            </Link>
          </>
        )}
      </div>
    </>
  );
};

export default QuizTypeOne;

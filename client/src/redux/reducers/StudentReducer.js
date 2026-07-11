import {
  GET_ALL_CHECKPOINT,
  GET_ALL_QUIZZ,
  GET_LEARNING_SCHEDULE,
  GET_STUDENT_CHECKPOINT,
  GET_STUDENT_INSTRUCTOR_NAME,
  GET_STUDENT_MEETING,
  GET_STUDENT_WORKSHOPS,
  NIGHT_MODE,
} from "../constants/actions-types";

const initialState = {
  night_mode: localStorage.getItem("night_mode") === "true",
  learningSchedule: undefined,
  checkpointSubmited: undefined,
  studentQuizScore: [],
  studentCheckpointScore: [],
  meetings: [],
  instructorName: "",
  workshops: [],
};

const StudentReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case NIGHT_MODE:
      localStorage.setItem("night_mode", payload);
      return { ...state, night_mode: payload };
    case GET_LEARNING_SCHEDULE:
      return { ...state, learningSchedule: payload };
    case GET_STUDENT_CHECKPOINT:
      return { ...state, checkpointSubmited: payload };
    case GET_ALL_QUIZZ:
      return { ...state, studentQuizScore: payload };
    case GET_ALL_CHECKPOINT:
      return { ...state, studentCheckpointScore: payload };
    case GET_STUDENT_MEETING:
      return { ...state, meetings: payload };
    case GET_STUDENT_INSTRUCTOR_NAME:
      return { ...state, instructorName: payload };
    case GET_STUDENT_WORKSHOPS:
      return { ...state, workshops: payload };
    default:
      return state;
  }
};

export default StudentReducer;

import {
  GET_CHECKPOINT_DETAILS,
  GET_STUDENTS_CHECKPOINTS_SUCCESS,
  GET_STUDENTS_PROGRESS,
  GET_MEETINGS,
  GET_WORKSHOPS,
  GET_STUDENTS_LEARNING_SCHEDULE,
} from "../constants/actions-types";

const initialState = {
  studentsCheckpoints: [],
  checkpointDetails: {},
  studentsProgress: [],
  meetings: [],
  workshops: [],
  studentSchedule: undefined,
};

const instructorReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_STUDENTS_CHECKPOINTS_SUCCESS:
      return {
        ...state,
        studentsCheckpoints: payload,
      };
    case GET_CHECKPOINT_DETAILS:
      return {
        ...state,
        checkpointDetails: payload,
      };
    case GET_STUDENTS_PROGRESS:
      return {
        ...state,
        studentsProgress: payload,
      };
    case GET_MEETINGS:
      return {
        ...state,
        meetings: payload,
      };
    case GET_WORKSHOPS:
      return {
        ...state,
        workshops: payload,
      };
    case GET_STUDENTS_LEARNING_SCHEDULE:
      return {
        ...state,
        studentSchedule: payload,
      };
    default:
      return state;
  }
};

export default instructorReducer;

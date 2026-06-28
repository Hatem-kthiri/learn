import { combineReducers } from "redux";
import LoginReducer from "./LoginReducer";
import StudentReducer from "./StudentReducer";
import ChatReducer from "./ChatReducer";
import instructorReducer from "./InstructorReducer";
const rootReducer = combineReducers({
  LoginReducer,
  StudentReducer,
  ChatReducer,
  instructorReducer,
});

export default rootReducer;

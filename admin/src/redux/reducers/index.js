import { combineReducers } from "redux";
import LoginReducer from "./LoginReducer";
import verticalReducer from "./verticalReducer";

const rootReducer = combineReducers({ LoginReducer, verticalReducer });

export default rootReducer;

import {
  CURRENT_USER,
  ERROR,
  LOADING,
  LOGIN_USER,
} from "../constants/actions-types";

const initialState = {
  user: {},
  userLoading: true,
  isAuth: false,
  loading: false,
  role: "",
  error: null,
};

const LoginReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case LOGIN_USER:
      localStorage.setItem("accessToken", payload.token);
      return {
        ...state,
        loading: true,
        isAuth: true,
        role: payload.role,
      };
    case CURRENT_USER:
      return {
        ...state,
        user: payload.data,
        userLoading: false,
      };
    case LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ERROR:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    default:
      return state;
  }
};

export default LoginReducer;

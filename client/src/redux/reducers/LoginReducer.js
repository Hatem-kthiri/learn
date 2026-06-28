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
  error: undefined,
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
        error: undefined,
      };
    case CURRENT_USER:
      return {
        ...state,
        loading: false,
        user: payload.data,
        userLoading: false,
      };
    case LOADING:
      return {
        ...state,
        loading: true,
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

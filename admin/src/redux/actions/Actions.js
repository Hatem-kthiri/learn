import { COLLAPSE } from "../constants/actions-types";

import { ERROR, LOADING, LOGIN_USER } from "../constants/actions-types";
import api from "../../utils/api";

export const collapse = () => {
  return { type: COLLAPSE };
};

export const login = (loginDetails) => (dispatch) => {
  dispatch({ type: LOADING });
  api
    .post(`/api/admin/login`, loginDetails)
    .then((response) =>
      dispatch({ type: LOGIN_USER, payload: response.data.data })
    )
    .catch((err) => {
      dispatch({ type: ERROR, payload: err.response.data.message });
    });
};

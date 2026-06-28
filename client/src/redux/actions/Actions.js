import {
  CURRENT_USER,
  ERROR,
  LOADING,
  LOGIN_USER,
} from "../constants/actions-types";
import axios from "axios";
import { successToast, url } from "../../utils";
export const login = (loginDetails) => (dispatch) => {
  dispatch({ type: LOADING });
  axios
    .post(`${url}/api/user/login`, loginDetails)
    .then((response) =>
      dispatch({ type: LOGIN_USER, payload: response.data.data })
    )
    .catch((err) => {
      dispatch({ type: ERROR, payload: err.response.data.message });
    });
};
export const current = () => async (dispatch) => {
  try {
    const config = {
      headers: {
        authorization: localStorage.getItem("accessToken"),
      },
    };
    let result = await axios
      .get(`${url}/api/user/loggedUser`, config)
      .catch((err) => {
        if (err.response.data.message === "Invalid token") {
          localStorage.removeItem("accessToken");
          window.location.reload();
        }
      });
    if (result.data.status) {
      dispatch({ type: CURRENT_USER, payload: result.data });
    }
  } catch (error) {}
};

export const updateProfileInstructor =
  ({ user, formData, setLoading }) =>
  (dispatch) => {
    axios
      .put(
        `${url}/api/instructor/update-instructor-profile/${user._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      )
      .then((res) => {
        dispatch(current());
        setLoading(false);
        successToast("Profile Updated !");
      })
      .catch((err) => {
        // console.clear():
      });
  };
export const updateProfileStudent =
  ({ user, formData, setLoading }) =>
  (dispatch) => {
    axios
      .put(`${url}/api/user/update-student-profile/${user._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        dispatch(current());
        setLoading(false);
        successToast("Profile Updated !");
      })
      .catch((err) => {
        // console.clear():
      });
  };

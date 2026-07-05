import axios from "axios";
import { errorToast, successToast, url } from "../../utils";
import {
  NIGHT_MODE,
  GET_LEARNING_SCHEDULE,
  GET_STUDENT_CHECKPOINT,
  GET_ALL_QUIZZ,
  GET_ALL_CHECKPOINT,
  GET_STUDENT_MEETING,
  GET_STUDENT_INSTRUCTOR_NAME,
  GET_STUDENT_WORKSHOPS,
} from "../constants/actions-types";

export const change_night_mode = (payload) => {
  return {
    type: NIGHT_MODE,
    payload: payload,
  };
};

export const get_learning_schedule = (user) => (dispatch) => {
  axios
    .get(
      `${url}/api/user/get-learning-schedule/${user._id}/${user.course[0].course._id}`,
    )
    .then((res) =>
      dispatch({ type: GET_LEARNING_SCHEDULE, payload: res.data.data }),
    )

    .catch((err) => {
      // console.clear():
    });
};
/*
// Checkpoint Actions 
*/
export const get_checkpoint =
  ({ user, id }) =>
  (dispatch) => {
    axios
      .get(`${url}/api/user/get-checkpoint/${user._id}/${id}`)
      .then((res) => {
        if (res.data) {
          dispatch({ type: GET_STUDENT_CHECKPOINT, payload: res.data });
        }
      })
      .catch((err) => {
        // console.clear():
      });
  };
export const add_checkpoint =
  ({
    checkpointName,
    checkpointId,
    guild,
    student,
    link,
    setSubmitLoading,
    user,
    setNextButton,
  }) =>
  (dispatch) => {
    if (
      link !== "" &&
      (link.includes("github") ||
        link.includes("drive") ||
        link.includes("edabit") ||
        link.includes("codewars"))
    ) {
      axios
        .post(`${url}/api/user/add-checkpoint`, {
          checkpointName,
          checkpointId,
          guild,
          student,
          link,
        })
        .then((res) => {
          successToast("Checkpoint Submitted");
          dispatch(get_checkpoint({ user, id: checkpointId }));
          if (setNextButton) {
            setNextButton(true);
          }
        })
        .catch((err) => {
          // console.clear():
        });
    } else {
      setSubmitLoading(false);

      errorToast("Add a Valid Link");
    }
  };

export const update_checkpoint =
  ({ id, link, user, checkpointId, setSubmitLoading }) =>
  (dispatch) => {
    if (link !== "" && (link.includes("github") || link.includes("drive"))) {
      axios
        .put(`${url}/api/user/update-checkpoint/${id}`, { link })
        .then((res) => {
          setSubmitLoading(false);
          successToast("Checkpoint updated !");
          dispatch(get_checkpoint({ user, id: checkpointId }));
        })
        .catch((err) => {
          // console.clear():
        });
    } else {
      setSubmitLoading(false);
      errorToast("Add a Valid Link");
    }
  };

export const get_all_quiz = (user) => (dispatch) => {
  axios
    .get(`${url}/api/user/get-all-Quiz/${user._id}`)
    .then((res) => dispatch({ type: GET_ALL_QUIZZ, payload: res.data.data }))
    .catch((err) => {
      // console.clear():
    });
};
export const get_all_checkpoint = (user) => (dispatch) => {
  axios
    .get(`${url}/api/user/get-all-checkpoint/${user._id}`)
    .then((res) =>
      dispatch({ type: GET_ALL_CHECKPOINT, payload: res.data.data }),
    )
    .catch((err) => {
      // console.clear():
    });
};
export const get_student_meeting = (guild) => (dispatch) => {
  axios
    .get(`${url}/api/user/get-meeting/${guild}`)
    .then((res) =>
      dispatch({ type: GET_STUDENT_MEETING, payload: res.data.data }),
    )
    .catch((err) => {
      // console.clear():
    });
};

export const get_instructor_name = (guild) => (dispatch) => {
  axios
    .get(`${url}/api/user/get-instructor-name/${guild}`)
    .then((res) =>
      dispatch({ type: GET_STUDENT_INSTRUCTOR_NAME, payload: res.data.data }),
    )
    .catch((err) => {
      // console.clear():
    });
};

export const get_student_workshops = (guild) => (dispatch) => {
  axios
    .get(`${url}/api/user/workshops/${guild}`)
    .then((res) => dispatch({ type: GET_STUDENT_WORKSHOPS, payload: res.data }))
    .catch((err) => console.log(err));
};

import axios from "axios";
import { errorToast, successToast, url } from "../../utils";
import {
  GET_CHECKPOINT_DETAILS,
  GET_MEETINGS,
  GET_STUDENTS_CHECKPOINTS_SUCCESS,
  GET_STUDENTS_LEARNING_SCHEDULE,
  GET_STUDENTS_PROGRESS,
  GET_WORKSHOPS,
} from "../constants/actions-types";

/*
// Instructor Checkpoint Actions 
*/
export const get_checkpoints = (user) => (dispatch) => {
  axios
    .get(`${url}/api/instructor/get-checkpoints`, {
      params: {
        guild: user.guild,
      },
    })
    .then((res) =>
      dispatch({
        type: GET_STUDENTS_CHECKPOINTS_SUCCESS,
        payload: res.data.data,
      })
    )

    .catch((err) => console.clear());
};
export const get_checkpoints_details = (id) => (dispatch) => {
  axios
    .get(`${url}/api/instructor/get-checkpoint-details/${id}`)
    .then((res) =>
      dispatch({ type: GET_CHECKPOINT_DETAILS, payload: res.data.data })
    )
    .catch((err) => {
      // console.clear():
    });
};
export const update_checkpoint_score =
  ({ id, value, navigate }) =>
  () => {
    axios
      .put(
        `${url}/api/instructor/submit-checkpoint-score/${id}`,
        {
          score: value,
        },
        { new: true }
      )
      .then((res) => navigate("/checkpoints"))
      .catch((err) => {
        // console.clear():
      });
  };

/*
// Instructor Students Details Action
*/
export const get_students_progress = (guild) => (dispatch) => {
  axios
    .get(`${url}/api/user/get-students-progress`, {
      params: {
        guild,
      },
    })
    .then((res) =>
      dispatch({ type: GET_STUDENTS_PROGRESS, payload: res.data.data })
    )
    .catch((err) => {
      // console.clear():
    });
};
/*
// Instructor Students Details Action
*/
export const get_student_learningSchedule =
  ({ studentId, courseId }) =>
  (dispatch) => {
    axios
      .get(`${url}/api/user/get-student-schedule`, {
        params: {
          studentId,
          courseId,
        },
      })
      .then((res) =>
        dispatch({
          type: GET_STUDENTS_LEARNING_SCHEDULE,
          payload: res.data.data,
        })
      )
      .catch((err) => {
        // console.clear():
      });
  };

/*
// Meetings Instructor Actions 
*/
export const get_meetings = (user) => (dispatch) => {
  axios
    .get(`${url}/api/instructor/get-meetings/${user._id}`)
    .then((res) => dispatch({ type: GET_MEETINGS, payload: res.data }))
    .catch((err) => {
      // console.clear():
    });
};
export const add_meeting =
  ({ user, meetDetails, handleModalAddShow, resetForm }) =>
  (dispatch) => {
    axios
      .post(`${url}/api/instructor/add-meeting/${user._id}`, meetDetails)
      .then((res) => {
        if (typeof handleModalAddShow === "function") handleModalAddShow(false);
        successToast("Meeting Added Succesfully");
        if (typeof resetForm === "function") resetForm();
        dispatch(get_meetings(user));
      })
      .catch((err) => {
        errorToast(err?.response?.data?.message || err?.response?.data?.errors?.[0]?.msg || "Failed to add meeting");
      });
  };
export const update_meeting =
  ({ user, modalEditDetails, meetDetails, handleModalEditShow }) =>
  (dispatch) => {
    axios
      .put(
        `${url}/api/instructor/update-meeting/${modalEditDetails?._id}`,
        meetDetails
      )
      .then((res) => {
        dispatch(get_meetings(user));
        if (typeof handleModalEditShow === "function") handleModalEditShow(false);
        successToast("Meeting updated Succesfully");
      })
      .catch((err) => {
        errorToast(err?.response?.data?.message || "Failed to update meeting");
      });
  };

export const delete_meeting =
  ({ user, id }) =>
  (dispatch) => {
    axios
      .delete(`${url}/api/instructor/delete-meeting/${id}`)
      .then((res) => {
        dispatch(get_meetings(user));
        successToast("Meeting Deleted");
      })
      .catch((err) => {
        errorToast(err?.response?.data?.message || "Failed to delete meeting");
      });
  };
/*
// Workshop  Actions 
*/
export const get_workshops = (id) => (dispatch) => {
  axios
    .get(`${url}/api/instructor/workshops/${id}`)
    .then((res) => dispatch({ type: GET_WORKSHOPS, payload: res.data }))
    .catch((err) => console.clear());
};
export const add_workshop =
  ({ workshop, user, setLoading, closeModal }) =>
  (dispatch) => {
    axios
      .post(`${url}/api/instructor/workshops`, {
        ...workshop,
        instructor: user._id,
      })
      .then((res) => {
        setLoading(false);
        successToast("Workshop Added");
        dispatch(get_workshops(user._id));
        closeModal();
      })
      .catch((err) => {
        errorToast(err?.response?.data?.message || err?.response?.data?.errors?.[0]?.msg || "Failed to add workshop");
        setLoading(false);
      });
  };
export const update_workshop =
  ({ workshop, user, setLoading, closeModal }) =>
  (dispatch) => {
    axios
      .put(`${url}/api/instructor/workshops/${workshop._id}`, {
        ...workshop,
      })
      .then((res) => {
        setLoading(false);
        dispatch(get_workshops(user._id));
        successToast("workshop Updated");
        closeModal();
      })
      .catch((err) => {
        errorToast(err?.response?.data?.message || "Failed to update workshop");
        setLoading(false);
      });
  };
export const delete_workshop =
  ({ user, id }) =>
  (dispatch) => {
    axios
      .delete(`${url}/api/instructor/workshops/${id}`)
      .then((res) => {
        dispatch(get_workshops(user._id));
        successToast("Workshop Deleted ");
      })
      .catch((err) => {
        errorToast(err?.response?.data?.message || "Failed to delete workshop");
      });
  };
export const update_instructor_password =
  ({ user, newPassword, navigate, setLoading }) =>
  () => {
    axios
      .put(`${url}/api/instructor/updatePassword/${user._id}`, newPassword)
      .then(() => {
        successToast("Password Changed Successfully");
        setLoading(false);
        setTimeout(() => {
          navigate("/dashboard-instructor");
        }, 2000);
      })
      .catch((err) => errorToast(err.response.data.message));
  };

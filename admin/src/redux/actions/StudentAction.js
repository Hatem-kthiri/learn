import { NIGHT_MODE } from "../constants/actions-types";

export const change_night_mode = (payload) => {
  return {
    type: NIGHT_MODE,
    payload: payload,
  };
};

import { COLLAPSE } from "../constants/actions-types";

const initialState = {
  verticalNav: true,
};

const verticalReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case COLLAPSE:
      return { ...state, verticalNav: !state.verticalNav };

    default:
      return state;
  }
};

export default verticalReducer;

import {
  ADDCHAT,
  ADDCHATDATA,
  ADDNOTIFICATION,
  MODALGROUPOPEN,
} from "../constants/actions-types";

const initialState = {
  notification: [],
  chats: [],
  selectedChat: undefined,
};

const ChatReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case ADDCHATDATA:
      return { ...state, selectedChat: payload };
    case ADDCHAT:
      return { ...state, chats: payload };
    case ADDNOTIFICATION:
      return {
        ...state,
        notification: payload,
      };
    default:
      return state;
  }
};

export default ChatReducer;

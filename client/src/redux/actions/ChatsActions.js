import axios from "axios";
import { url } from "../../utils";
import {
  ADDCHAT,
  ADDCHATDATA,
  ADDNOTIFICATION,
} from "../constants/actions-types";

const add_selectedChat = (payload) => {
  return {
    type: ADDCHATDATA,
    payload,
  };
};

const add_Chat = (payload) => {
  return {
    type: ADDCHAT,
    payload,
  };
};

const add_notification = (payload) => {
  return {
    type: ADDNOTIFICATION,
    payload,
  };
};

export { add_Chat, add_selectedChat, add_notification };

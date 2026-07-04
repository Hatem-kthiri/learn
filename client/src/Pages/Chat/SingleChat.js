import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { url } from "../../utils";
import ClipLoader from "react-spinners/ClipLoader";
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { add_notification } from "../../redux/actions/ChatsActions";
import axios from "axios";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import { modal_config } from "../../redux/actions/ChatsActions";

let socket, selectedChatCompare;

const getSender = (loggedUser, users) =>
  users?.find((u) => u._id !== loggedUser?._id);
const isMine = (loggedUser, sender) => sender?._id === loggedUser?._id;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user } = useSelector((state) => state.LoginReducer);
  const { selectedChat, notification } = useSelector(
    (state) => state.ChatReducer,
  );
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${url}/api/v1/message/${selectedChat._id}`,
      );
      setMessages(data);
      socket.emit("join-chat", selectedChat._id);
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    if ((e.key === "Enter" && newMessage) || (e === "click" && newMessage)) {
      socket.emit("stop-typing", selectedChat._id);
      try {
        const { data } = await axios.post(`${url}/api/v1/message/`, {
          message: newMessage,
          chatId: selectedChat._id,
          userConnected: user._id,
        });
        setNewMessage("");
        socket.emit("new-message", data);
        setMessages([...messages, data]);
      } catch {
        toast.error("Failed to send message");
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    socket.emit("typing", selectedChat._id);
    setTimeout(() => socket.emit("stop-typing", selectedChat._id), 3000);
  };

  useEffect(() => {
    socket = io(url);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop-typing", () => setIsTyping(false));
  }, [user]);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMsg) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMsg.chat._id) {
        if (!notification.includes(newMsg))
          dispatch(add_notification([newMsg, ...notification]));
      } else {
        setMessages([...messages, newMsg]);
      }
    });
  });

  const [modalConfig, setModalConfig] = useState({
    show: false,
    display: "none",
  });
  const closeModal = () => {
    setModalConfig({ show: false, display: "none" });
  };
  const otherUser =
    selectedChat && !selectedChat.isGroupChat
      ? getSender(user, selectedChat.users)
      : null;

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center h-full text-slate-400">
        <div className="text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-comments text-3xl opacity-30"></i>
          </div>
          <p className="font-semibold text-lg">Start a Conversation</p>
          <p className="text-sm mt-1 max-w-xs">
            Select a chat from the list or search for someone to message
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-100 flex-shrink-0">
        <div className="relative">
          {selectedChat.isGroupChat ? (
            <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-users text-violet-600 text-sm"></i>
            </div>
          ) : (
            <img
              src={otherUser?.profileImg}
              alt=""
              className="w-10 h-10 rounded-xl object-cover bg-slate-100"
            />
          )}
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></span>
        </div>
        <div className="flex-1">
          <p className="font-bold text-slate-900 text-sm">
            {selectedChat.isGroupChat
              ? selectedChat.chatName
              : `${otherUser?.firstName} ${otherUser?.lastName}`}
          </p>
          {isTyping && (
            <p className="text-xs text-indigo-500 font-medium">typing...</p>
          )}
        </div>
        {selectedChat.isGroupChat && (
          <button
            onClick={() =>
              setModalConfig({
                show: true,
                display: "block",
              })
            }
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <i className="fas fa-cog text-xs"></i>
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <ClipLoader color="#4f46e5" size={32} />
          </div>
        ) : (
          messages.map((msg, i) => {
            const mine = isMine(user, msg.sender);
            return (
              <div
                key={i}
                className={`flex items-end gap-2 ${mine ? "flex-row-reverse" : "flex-row"}`}
              >
                {!mine && (
                  <img
                    src={msg.sender?.profileImg}
                    alt=""
                    className="w-7 h-7 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                  />
                )}
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${mine ? "bg-indigo-600 text-white rounded-br-sm" : "bg-slate-100 text-slate-900 rounded-bl-sm"}`}
                >
                  {!mine && (
                    <p className="text-xs font-bold mb-0.5 text-indigo-600">
                      {msg.sender?.firstName}
                    </p>
                  )}
                  <p>{msg.message}</p>
                  <p
                    className={`text-xs mt-1 ${mine ? "text-indigo-200" : "text-slate-400"}`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={typingHandler}
            onKeyDown={sendMessage}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <button
            onClick={() => sendMessage("click")}
            disabled={!newMessage}
            className="w-11 h-11 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white rounded-xl flex items-center justify-center transition-all flex-shrink-0"
          >
            <i className="fas fa-paper-plane text-sm"></i>
          </button>
        </div>
      </div>

      {/* Group edit modal */}
      {modalConfig?.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={closeModal}
          ></div>
          <div className="relative z-10 w-full max-w-md">
            <UpdateGroupChatModal
              fetchAgain={fetchAgain}
              setFetchAgain={setFetchAgain}
              fetchMessages={fetchMessages}
              closeModal={closeModal}
              modalConfig={modalConfig}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleChat;

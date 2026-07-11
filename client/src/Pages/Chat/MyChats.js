import React, { useState, useEffect } from "react";
import { url } from "../../utils/index";
import { toast } from "react-toastify";
import UserListItem from "./UserList";
import { useDispatch, useSelector } from "react-redux";
import {
  add_selectedChat,
  add_Chat,
  modal_config,
} from "../../redux/actions/ChatsActions";
import axios from "axios";
import GroupChatModal from "./GroupChatModal";

const getSender = (loggedUser, users) =>
  users?.find((u) => u && u._id !== loggedUser?._id);

const calculateTimeDiff = (date) => {
  if (!date) return "";
  const diff = Math.floor((Date.now() - new Date(date)) / 60000);
  if (diff < 1) return "just now";
  if (diff < 60) return `${diff}m`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h`;
  return `${Math.floor(diff / 1440)}d`;
};

const MyChats = ({ fetchAgain }) => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatWait, setChatWait] = useState(false);
  const { chats, selectedChat } = useSelector((state) => state.ChatReducer);
  const { user, userLoading } = useSelector((state) => state.LoginReducer);
  const dispatch = useDispatch();

  const fetchChats = async () => {
    try {
      const { data } = await axios.get(
        `${url}/api/v1/chat/getChats/${user._id}`,
      );
      dispatch(add_Chat(data));
    } catch (e) {
      toast.error("Failed to load chats");
    }
  };

  useEffect(() => {
    if (!userLoading) fetchChats();
  }, [fetchAgain, user]);

  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearch(q);
    if (!q) {
      setSearchResult([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(`${url}/api/v1/chat/users?search=${q}`);
      setSearchResult(data);
    } catch {
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    setChatWait(true);
    try {
      const { data } = await axios.post(`${url}/api/v1/chat`, { userId });
      dispatch(add_selectedChat(data));
      setSearch("");
      setSearchResult([]);
    } catch {
      toast.error("Could not start chat");
    } finally {
      setChatWait(false);
    }
  };

  const [modalConfig, setModalConfig] = useState({
    show: false,
    display: "none",
  });
  const closeModal = () => {
    setModalConfig({ show: false, display: "none" });
  };

  return (
    <div className="w-72 flex-shrink-0 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-slate-900">Messages</h2>
          <button
            onClick={() => {
              setModalConfig({ show: true, display: "block" });
            }}
            className="w-8 h-8 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 flex items-center justify-center transition-colors"
            title="New group chat"
          >
            <i className="fas fa-users-cog text-xs"></i>
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search people..."
            value={search}
            onChange={handleSearch}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
          {loading && (
            <i className="fas fa-spinner fa-spin absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
          )}
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {search && searchResult.length > 0 ? (
          <div className="p-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 py-1.5">
              Search Results
            </p>
            {searchResult.map((u) => (
              <UserListItem
                key={u._id}
                user={u}
                handleFunction={() => accessChat(u._id)}
              />
            ))}
          </div>
        ) : !search && chats?.length > 0 ? (
          <div className="p-2">
            {chats.map((chat) => {
              const isSelected = selectedChat?._id === chat._id;
              const sender = getSender(user, chat.users);
              return (
                <button
                  key={chat._id}
                  onClick={() => dispatch(add_selectedChat(chat))}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all text-left mb-0.5 ${isSelected ? "bg-indigo-600" : "hover:bg-slate-50"}`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={chat.isGroupChat ? null : sender?.profileImg}
                      alt=""
                      className={`w-10 h-10 rounded-xl object-cover ${!sender?.profileImg ? "bg-indigo-100" : "bg-slate-100"}`}
                    />
                    {chat.isGroupChat && (
                      <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                        <i className="fas fa-users text-violet-600 text-sm"></i>
                      </div>
                    )}
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p
                        className={`font-semibold text-sm truncate ${isSelected ? "text-white" : "text-slate-900"}`}
                      >
                        {chat.isGroupChat
                          ? chat.chatName
                          : `${sender?.firstName} ${sender?.lastName}`}
                      </p>
                      <span
                        className={`text-xs flex-shrink-0 ml-1 ${isSelected ? "text-indigo-200" : "text-slate-400"}`}
                      >
                        {calculateTimeDiff(chat.latestMessage?.updatedAt)}
                      </span>
                    </div>
                    <p
                      className={`text-xs truncate mt-0.5 ${isSelected ? "text-indigo-200" : "text-slate-400"}`}
                    >
                      {chat.latestMessage?.message || "No messages yet"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-12 text-slate-400">
            <i className="fas fa-comments text-4xl mb-3 opacity-20"></i>
            <p className="text-sm font-medium">
              {search ? "No results found" : "No conversations yet"}
            </p>
            <p className="text-xs mt-1 text-center px-4">
              {!search && "Search for someone to start chatting"}
            </p>
          </div>
        )}
      </div>

      {/* Group chat modal */}
      {modalConfig?.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={closeModal}
          ></div>
          <div className="relative z-10 w-full max-w-md">
            <GroupChatModal closeModal={closeModal} user={user} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyChats;

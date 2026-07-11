import React, { useState } from "react";
import UserListItem from "./UserList";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { url } from "../../utils";
import { add_selectedChat } from "../../redux/actions/ChatsActions";
import ClipLoader from "react-spinners/ClipLoader";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain, closeModal }) => {
  const { user } = useSelector((state) => state.LoginReducer);
  const { selectedChat } = useSelector((state) => state.ChatReducer);
  const dispatch = useDispatch();
  const [groupChatName, setGroupChatName] = useState(selectedChat?.chatName || "");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) { setSearchResult([]); return; }
    try {
      const { data } = await axios.get(`${url}/api/v1/chat/users?search=${query}`);
      setSearchResult(data);
    } catch { toast.error("Search failed"); }
  };

  const handleRename = async () => {
    if (!groupChatName) return;
    setRenameLoading(true);
    try {
      const { data } = await axios.patch(`${url}/api/v1/chat/renameGroup`, { chatId: selectedChat._id, chatName: groupChatName });
      dispatch(add_selectedChat(data));
      toast.success("Group renamed");
    } catch { toast.error("Rename failed"); } finally { setRenameLoading(false); }
  };

  const handleAdd = async (userToAdd) => {
    if (selectedChat.users.find((u) => u && u._id === userToAdd._id)) { toast.error("Already in group"); return; }
    if (selectedChat.groupAdmin !== user._id) { toast.error("Only admin can add users"); return; }
    setLoading(true);
    try {
      const { data } = await axios.patch(`${url}/api/v1/chat/addToGroup`, { chatId: selectedChat._id, userId: userToAdd._id });
      dispatch(add_selectedChat(data));
      setFetchAgain(!fetchAgain);
    } catch { toast.error("Failed to add user"); } finally { setLoading(false); }
  };

  const handleRemove = async (userToRemove) => {
    if (selectedChat.groupAdmin !== user._id && userToRemove._id !== user._id) { toast.error("Only admin can remove users"); return; }
    setLoading(true);
    try {
      const { data } = await axios.patch(`${url}/api/v1/chat/removeFromGroup`, { chatId: selectedChat._id, userId: userToRemove._id });
      userToRemove._id === user._id ? dispatch(add_selectedChat()) : dispatch(add_selectedChat(data));
      setFetchAgain(!fetchAgain);
      fetchMessages();
    } catch { toast.error("Failed to remove user"); } finally { setLoading(false); }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden dark:bg-gray-800">
      <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-gray-700">
        <h3 className="font-bold text-slate-900 dark:text-white">Edit Group: {selectedChat?.chatName}</h3>
        <button onClick={closeModal} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-400">
          <i className="fas fa-times text-sm"></i>
        </button>
      </div>
      <div className="p-6 space-y-5">
        {/* Rename */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 dark:text-gray-200">Group Name</label>
          <div className="flex gap-2">
            <input type="text" value={groupChatName} onChange={(e) => setGroupChatName(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:bg-gray-900 dark:border-gray-600" />
            <button onClick={handleRename} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all flex items-center gap-1.5">
              {renameLoading ? <ClipLoader color="#fff" size={14} /> : <><i className="fas fa-save text-xs"></i> Save</>}
            </button>
          </div>
        </div>

        {/* Search to add */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 dark:text-gray-200">Add Member</label>
          <div className="relative">
            <input type="text" placeholder="Search users..." value={search} onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:bg-gray-900 dark:border-gray-600" />
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs dark:text-gray-500"></i>
          </div>
          {searchResult.length > 0 && (
            <div className="mt-2 max-h-32 overflow-y-auto border border-slate-100 rounded-xl dark:border-gray-700">
              {searchResult.map((u) => <UserListItem key={u._id} user={u} handleFunction={() => handleAdd(u)} />)}
            </div>
          )}
        </div>

        {/* Members list */}
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2 dark:text-gray-200">Members ({selectedChat?.users?.length})</p>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {selectedChat?.users?.map((u) => (
              <div key={u._id} className="flex items-center gap-2 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-700">
                <img src={u.profileImg} alt="" className="w-8 h-8 rounded-xl object-cover bg-slate-100 flex-shrink-0 dark:bg-gray-700" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate dark:text-white">{u.firstName} {u.lastName}</p>
                  {selectedChat.groupAdmin === u._id && <p className="text-xs text-indigo-600 font-medium">Admin</p>}
                </div>
                <button onClick={() => handleRemove(u)} className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors flex-shrink-0">
                  <i className="fas fa-times text-xs"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="p-6 border-t border-slate-100 dark:border-gray-700">
        <button onClick={() => handleRemove(user)} className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
          <i className="fas fa-sign-out-alt"></i> Leave Group
        </button>
      </div>
    </div>
  );
};

export default UpdateGroupChatModal;

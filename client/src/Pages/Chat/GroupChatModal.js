import React, { useState } from "react";
import { url } from "../../utils";
import UserListItem from "./UserList";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { add_Chat } from "../../redux/actions/ChatsActions";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

const GroupChatModal = ({ closeModal, user }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const { chats } = useSelector((state) => state.ChatReducer);
  const dispatch = useDispatch();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) { setSearchResult([]); return; }
    setLoading(true);
    try {
      const { data } = await axios.get(`${url}/api/v1/chat/users?search=${query}`);
      setSearchResult(data);
    } catch { toast.error("Search failed"); } finally { setLoading(false); }
  };

  const handleGroup = (u) => {
    if (selectedUsers.find((s) => s._id === u._id)) { toast.error("Already added"); return; }
    setSelectedUsers([...selectedUsers, u]);
  };

  const handleDelete = (u) => setSelectedUsers(selectedUsers.filter((s) => s._id !== u._id));

  const handleSubmit = async () => {
    if (!groupChatName || selectedUsers.length < 2) { toast.error("Need a name and at least 2 users"); return; }
    try {
      const { data } = await axios.post(`${url}/api/v1/chat/createGroup`, { name: groupChatName, users: JSON.stringify(selectedUsers.map((u) => u._id)) });
      dispatch(add_Chat([...chats, data]));
      toast.success("Group created!");
      closeModal();
    } catch { toast.error("Failed to create group"); }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-slate-100">
        <h3 className="font-bold text-slate-900">New Group Chat</h3>
        <button onClick={closeModal} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500">
          <i className="fas fa-times text-sm"></i>
        </button>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Group Name</label>
          <input type="text" placeholder="e.g. Study Group" value={groupChatName} onChange={(e) => setGroupChatName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Add Members</label>
          <div className="relative">
            <input type="text" placeholder="Search users..." value={search} onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
          </div>
        </div>

        {/* Selected users */}
        {selectedUsers.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedUsers.map((u) => (
              <span key={u._id} className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                {u.firstName}
                <button onClick={() => handleDelete(u)} className="hover:text-indigo-900 transition-colors"><i className="fas fa-times text-xs"></i></button>
              </span>
            ))}
          </div>
        )}

        {/* Search results */}
        {loading ? (
          <div className="flex justify-center py-4"><ClipLoader color="#4f46e5" size={24} /></div>
        ) : searchResult.length > 0 ? (
          <div className="max-h-40 overflow-y-auto border border-slate-100 rounded-xl">
            {searchResult.map((u) => <UserListItem key={u._id} user={u} handleFunction={() => handleGroup(u)} />)}
          </div>
        ) : null}
      </div>
      <div className="flex gap-3 p-6 border-t border-slate-100">
        <button onClick={closeModal} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-sm transition-all">Cancel</button>
        <button onClick={handleSubmit} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
          <i className="fas fa-users"></i> Create Group
        </button>
      </div>
    </div>
  );
};

export default GroupChatModal;

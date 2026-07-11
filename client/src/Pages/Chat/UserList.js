const UserListItem = ({ user, handleFunction }) => (
  <button onClick={handleFunction} className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left dark:hover:bg-gray-700">
    <img src={user.profileImg} alt={user.firstName} className="w-9 h-9 rounded-xl object-cover bg-slate-100 flex-shrink-0 dark:bg-gray-700" />
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-slate-900 text-sm truncate dark:text-white">{user.firstName} {user.lastName}</p>
      <p className="text-xs text-slate-400 truncate dark:text-gray-500">{user.email}</p>
    </div>
  </button>
);

export default UserListItem;

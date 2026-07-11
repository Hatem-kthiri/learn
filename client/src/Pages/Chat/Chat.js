import React, { useState } from "react";
import MyChats from "./MyChats";
import ChatBox from "./ChatBox";
import { useSelector } from "react-redux";
import HeaderS from "../../Components/Header/HeaderS";
import HeaderI from "../../Components/Header/HeaderI";
import { SocketProvider } from "../../context/SocketContext";

const Chat = () => {
  const { user, userLoading } = useSelector((state) => state.LoginReducer);
  const [fetchAgain, setFetchAgain] = useState(false);

  // Determine which header to use based on role
  const role = user?.role;

  return (
    <SocketProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col dark:bg-gray-900">
        {+role === 1 ? <HeaderI /> : <HeaderS />}
        <div className="flex flex-1 overflow-hidden max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 gap-5">
          {user && <MyChats fetchAgain={fetchAgain} />}
          {user && (
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
        </div>
      </div>
    </SocketProvider>
  );
};

export default Chat;

import React from "react";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => (
  <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col min-h-[600px]">
    <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
  </div>
);

export default ChatBox;

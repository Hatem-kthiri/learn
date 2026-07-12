const Message = require("../models/message.js");
const User = require("../models/user.js");
const Chat = require("../models/chat.js");
const { StatusCodes } = require("http-status-codes");
const Student = require("../models/Student");
const Instructor = require("../models/Instructor");
const mongoose = require("mongoose");

const getChatUsersInfo = async (chat) => {
  const usersWithInfo = [];

  for (const userId of chat.users) {
    let userInfo = await Student.findOne({ _id: userId }).select(
      "firstName lastName profileImg"
    );
    if (!userInfo) {
      userInfo = await Instructor.findOne({ _id: userId }).select(
        "firstName lastName profileImg"
      );
    }

    usersWithInfo.push(userInfo);
  }
  const chatWithUserInfo = {
    ...chat,
    users: usersWithInfo.filter(Boolean),
  };
  return chatWithUserInfo;
};
const getSenderInfo = async (data) => {
  let userInfo = await Student.findOne({ _id: data.sender }).select(
    "firstName lastName profileImg"
  );
  if (!userInfo) {
    userInfo = await Instructor.findOne({ _id: data.sender }).select(
      "firstName lastName profileImg"
    );
  }

  const newData = {
    ...data.toObject(),
    sender: userInfo,
  };
  return newData;
};
const sendMessage = async (req, res) => {
  const { message, chatId, userConnected } = req.body;

  if (!message || !chatId) {
    return "Please Provide All Fields To send Message";
  }

  let newMessage = {
    sender: userConnected,
    message: message,
    chat: chatId,
  };

  let m = await Message.create({ ...newMessage });
  let messageCreated = await Message.findOne({ _id: m._id }).populate("chat");
  let mPopulatedSender = await getSenderInfo(messageCreated);
  let { chat } = mPopulatedSender;
  mPopulatedSender = {
    ...mPopulatedSender,
    chat: await getChatUsersInfo(chat),
  };

  await Chat.findByIdAndUpdate(chatId, { latestMessage: m._id }, { new: true });

  res.status(StatusCodes.OK).json(mPopulatedSender);
};

// const allMessages = async (req, res) => {
//   const { chatId } = req.params;

//   const getMessage = await Message.find({ chat: chatId })
//     .populate("chat");

//   res.status(StatusCodes.OK).json(getMessage);
// };
const allMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const messages = await Message.find({ chat: chatId }).populate("chat");

    const transformedMessages = [];

    for (const message of messages) {
      const messageWithSenderInfo = await getSenderInfo(message);
      const messageWithUpdatedChat = await getChatUsersInfo(
        messageWithSenderInfo.chat
      );

      transformedMessages.push({
        ...messageWithSenderInfo,
        chat: messageWithUpdatedChat,
      });
    }
    res.status(StatusCodes.OK).json(transformedMessages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An error occurred while fetching messages" });
  }
};

// Per-chat unread counts for every chat this user belongs to, in one
// aggregation query — powers the sidebar badges without an N+1 query per
// chat. Returns { counts: { [chatId]: number }, total: number }.
const getUnreadCounts = async (req, res) => {
  try {
    const { userId } = req.params;

    const chats = await Chat.find({ users: userId }).select("_id");
    const chatIds = chats.map((c) => c._id);

    const results = await Message.aggregate([
      {
        $match: {
          chat: { $in: chatIds },
          read: false,
          sender: { $ne: new mongoose.Types.ObjectId(userId) },
        },
      },
      { $group: { _id: "$chat", count: { $sum: 1 } } },
    ]);

    const counts = {};
    let total = 0;
    for (const r of results) {
      counts[r._id.toString()] = r.count;
      total += r.count;
    }

    res.status(StatusCodes.OK).json({ counts, total });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while counting unread messages" });
  }
};

// Marks every message in a chat NOT sent by this user as read — called
// when the user opens that conversation.
const markChatRead = async (req, res) => {
  try {
    const { chatId, userId } = req.params;
    const result = await Message.updateMany(
      { chat: chatId, sender: { $ne: userId }, read: false },
      { $set: { read: true } },
    );
    res.status(StatusCodes.OK).json({ message: "Marked as read", modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while marking messages as read" });
  }
};

module.exports = { allMessages, sendMessage, getUnreadCounts, markChatRead };

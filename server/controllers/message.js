const Message = require("../models/message.js");
const User = require("../models/user.js");
const Chat = require("../models/chat.js");
const { StatusCodes } = require("http-status-codes");
const Student = require("../models/Student");
const Instructor = require("../models/Instructor");

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
    users: usersWithInfo,
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

module.exports = { allMessages, sendMessage };

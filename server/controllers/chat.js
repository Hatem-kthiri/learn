const { StatusCodes } = require("http-status-codes");
const Chat = require("../models/chat.js");
const User = require("../models/user.js");
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
    ...chat.toObject(),
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
const getGroupAdmin = async (data) => {
  let userInfo = await Student.findOne({ _id: data.groupAdmin }).select(
    "firstName lastName profileImg"
  );
  if (!userInfo) {
    userInfo = await Instructor.findOne({ _id: data.groupAdmin }).select(
      "firstName lastName profileImg"
    );
  }

  const newData = {
    ...data,
    groupAdmin: userInfo,
  };
  return newData;
};
const getChat = async (req, res) => {
  const { userId, userConnected } = req.body;
  if (!userId) {
    return res.send("No User Exists!");
  }

  let chat = await Chat.findOne({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: userConnected } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  });

  // chat = await User.populate(chat, {
  //   path: "latestMessage.sender",
  //   select: "username avatar email fullName _id",
  // });
  if (chat) {
    chat = await getChatUsersInfo(chat);
    res.send(chat);
  } else {
    const createChat = await Chat.create({
      chatName: "sender",
      isGroupChat: false,
      users: [userConnected, userId],
    });

    const getChatWithUserInfo = async (chatId) => {
      const fullChat = await Chat.findOne({ _id: chatId });

      if (!fullChat) {
        return null; // Chat not found
      }

      const usersWithInfo = [];

      for (const userId of fullChat.users) {
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
        ...fullChat.toObject(),
        users: usersWithInfo,
      };
      return chatWithUserInfo;
    };

    const fullConv = await getChatWithUserInfo(createChat._id);

    res.status(StatusCodes.OK).json(fullConv);
  }
};

const getChats = async (req, res) => {
  let { id } = req.params;
  if (id !== "undefined") {
    const chat = await Chat.find({
      users: { $elemMatch: { $eq: id } },
    })
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
    // .populate("users", "-password")
    // .populate("groupAdmin", "-password")

    var processedChats = [];

    for (const chatData of chat) {
      const chatWithUsersInfo = await getChatUsersInfo(chatData);

      if (chatData.latestMessage) {
        const latestMessageWithSenderInfo = await getSenderInfo(
          chatData.latestMessage
        );
        chatWithUsersInfo.latestMessage = latestMessageWithSenderInfo;
      }

      processedChats.push(chatWithUsersInfo);
    }
    // processedChats = await getGroupAdmin(processedChats);

    res.status(StatusCodes.OK).json(processedChats);
  }
};

const createGroup = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }
  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.body.userConnected);

  const groupChat = await Chat.create({
    chatName: req.body.name,
    users: users,
    isGroupChat: true,
    groupAdmin: req.body.userConnected,
  });

  var fullGroupChat = await Chat.findOne({ _id: groupChat._id });
  fullGroupChat = await getChatUsersInfo(fullGroupChat);
  fullGroupChat = await getGroupAdmin(fullGroupChat);
  res.status(200).json(fullGroupChat);
};

const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  let updateChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  );
  updateChat = await getChatUsersInfo(updateChat);
  updateChat = await getGroupAdmin(updateChat);
  if (!updateChat) {
    throw "Chat Not Found";
  } else {
    res.json(updateChat);
  }
};

const addUserToGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  let chat = await Chat.findOne({ _id: chatId });
  let userExist = chat.users.find((user) => user._id == userId);
  if (userExist) {
    console.log("user Exist");
  } else {
    let addUser = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    );
    addUser = await getChatUsersInfo(addUser);
    addUser = await getGroupAdmin(addUser);

    if (!addUser) {
      throw "Chat Not Found";
    } else {
      res.status(StatusCodes.OK).json(addUser);
    }
  }
};

const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  let removeUser = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  );
  removeUser = await getChatUsersInfo(removeUser);
  removeUser = await getGroupAdmin(removeUser);
  if (!removeUser) {
    throw "Chat Not Found";
  } else {
    res.status(StatusCodes.OK).json(removeUser);
  }
};

const searchUser = async (req, res) => {
  const { search } = req.query;

  const today = new Date();
  const students = await Student.find({
    expiryDate: { $gt: today },
  }).select("firstName lastName email profileImg");
  const instructors = await Instructor.find({}).select(
    "firstName lastName email profileImg"
  );

  const findUser = await [...students, ...instructors].filter(
    (user) => user.firstName.includes(search) || user.lastName.includes(search)
  );

  res.status(StatusCodes.OK).json(findUser);
};
const usersList = async (req, res) => {
  const today = new Date();
  const students = await Student.find({
    expiryDate: { $gt: today },
  }).select("firstName lastName email profileImg");
  const instructors = await Instructor.find({}).select(
    "firstName lastName email profileImg"
  );

  res.status(StatusCodes.OK).json([...students, ...instructors]);
};
module.exports = {
  getChat,
  getChats,
  createGroup,
  removeFromGroup,
  renameGroup,
  addUserToGroup,
  searchUser,
  usersList,
};

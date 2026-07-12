const express = require("express");
const {
  allMessages,
  sendMessage,
  getUnreadCounts,
  markChatRead,
} = require("../controllers/message.js");
const router = express.Router();

router.route("/:chatId").get(allMessages);
router.route("/").post(sendMessage);
router.get("/unread/:userId", getUnreadCounts);
router.patch("/mark-read/:chatId/:userId", markChatRead);

module.exports = router;

const express = require("express");
const router = express.Router();

const {
  getChat,
  getChats,
  createGroup,
  renameGroup,
  removeFromGroup,
  addUserToGroup,
  searchUser,
  usersList,
} = require("../controllers/chat.js");

router.route("/").post(getChat);
router.route("/getChats/:id").get(getChats);
router.route("/createGroup").post(createGroup);
router.route("/renameGroup").patch(renameGroup);
router.route("/removeFromGroup").patch(removeFromGroup);
router.route("/addUserToGroup").patch(addUserToGroup);
router.route("/users").get(searchUser);
router.route("/users-list").get(usersList);

module.exports = router;

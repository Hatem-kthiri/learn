/**
 * One-off repair script for chats broken by the missing-`userConnected` bug
 * in accessChat/createGroup: those chats were created with `null` in place
 * of the initiator's id, e.g. users: [null, otherUserId]. getChatUsersInfo
 * silently filters null entries, which is why the app "worked" but showed
 * "undefined undefined" and one-directional real-time delivery for anyone
 * who ever started a conversation before the fix.
 *
 * This script finds every chat with a null in its `users` array, looks up
 * the actual sender ids from that chat's messages, and fills in whichever
 * sender id is missing from `users`.
 *
 * Run manually, once, after deploying the accessChat/createGroup fix:
 *   node scripts/repair-chat-participants.js
 *
 * It's idempotent and safe to re-run — chats with no null entries are
 * skipped, and chats it can't confidently repair (no message history to
 * recover the id from) are only reported, never guessed at.
 */
require("dotenv").config();
const mongoose = require("mongoose");
const Chat = require("../models/chat");
const Message = require("../models/message");

async function repair() {
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    console.error("MONGO_URI is not set — aborting.");
    process.exit(1);
  }

  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to DB.");

  const brokenChats = await Chat.find({
    isGroupChat: false,
    users: { $elemMatch: { $eq: null } },
  });

  console.log(`Found ${brokenChats.length} chat(s) with a missing participant.`);

  let repaired = 0;
  let unresolved = 0;

  for (const chat of brokenChats) {
    const knownIds = chat.users.filter(Boolean).map((id) => String(id));

    const messages = await Message.find({ chat: chat._id }).select("sender");
    const senderIds = [...new Set(messages.map((m) => String(m.sender)))];

    const missing = senderIds.find((id) => !knownIds.includes(id));

    if (!missing) {
      console.log(
        `  chat ${chat._id}: no message history to recover the missing user from — skipped.`,
      );
      unresolved += 1;
      continue;
    }

    const newUsers = [...knownIds, missing];
    await Chat.updateOne({ _id: chat._id }, { $set: { users: newUsers } });
    console.log(`  chat ${chat._id}: restored missing participant ${missing}.`);
    repaired += 1;
  }

  console.log(`\nDone. Repaired: ${repaired}. Left unresolved: ${unresolved}.`);
  console.log(
    "Unresolved chats have no messages yet, so there's nothing to recover from — " +
      "they'll self-heal the next time that conversation is opened, now that the " +
      "underlying accessChat/createGroup bug is fixed.",
  );

  await mongoose.disconnect();
}

repair().catch((err) => {
  console.error(err);
  process.exit(1);
});

/**
 * seed.js — create (or update) an Admin login from the command line.
 *
 * Usage:
 *   node seed.js --email admin@example.com --password "SomeStrongPass1" --name "Jane Doe"
 *
 * Or run with no flags and it will prompt interactively.
 *
 * Requires backend/.env to have `mongoURI` set (same as the app itself).
 */
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const readline = require("readline");
const Admin = require("./models/Admin");

// ── Parse CLI flags (--email, --password, --name) ─────────────────────────
function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      const key = args[i].slice(2);
      out[key] = args[i + 1];
      i++;
    }
  }
  return out;
}

// ── Fallback interactive prompt if flags weren't passed ───────────────────
function prompt(question, hidden = false) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    if (!hidden) {
      rl.question(question, (answer) => {
        rl.close();
        resolve(answer.trim());
      });
      return;
    }

    // Basic masked input for the password prompt
    const stdin = process.stdin;
    process.stdout.write(question);
    let input = "";
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");

    const onData = (char) => {
      char = char.toString();
      if (char === "\n" || char === "\r" || char === "\u0004") {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.removeListener("data", onData);
        process.stdout.write("\n");
        rl.close();
        resolve(input.trim());
      } else if (char === "\u0003") {
        // Ctrl+C
        process.exit(1);
      } else if (char === "\u007f") {
        // backspace
        input = input.slice(0, -1);
      } else {
        input += char;
      }
    };

    stdin.on("data", onData);
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongEnough(password) {
  return password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
}

async function main() {
  const flags = parseArgs();

  let { email, password, name } = flags;

  if (!email) {
    email = await prompt("Admin email: ");
  }
  if (!isValidEmail(email)) {
    console.error("❌ Invalid email address.");
    process.exit(1);
  }

  if (!name) {
    name = await prompt("Admin full name: ");
  }
  if (!name) {
    console.error("❌ Full name is required.");
    process.exit(1);
  }

  if (!password) {
    password = await prompt("Admin password (min 8 chars, letters + numbers): ", true);
  }
  if (!isStrongEnough(password)) {
    console.error(
      "❌ Password must be at least 8 characters and contain at least one letter and one number."
    );
    process.exit(1);
  }

  if (!process.env.mongoURI) {
    console.error("❌ mongoURI is not set in your .env file.");
    process.exit(1);
  }

  console.log("\nConnecting to database...");
  await mongoose.connect(process.env.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const existing = await Admin.findOne({ email });
  const hashedPassword = await bcrypt.hash(password, 10);

  if (existing) {
    existing.password = hashedPassword;
    existing.fullName = name;
    await existing.save();
    console.log(`\n✓ Existing admin "${email}" found — password and name updated.`);
  } else {
    await Admin.create({
      fullName: name,
      email,
      password: hashedPassword,
    });
    console.log(`\n✓ New admin account created for "${email}".`);
  }

  console.log("Done. You can now log in with this email and password.\n");
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});

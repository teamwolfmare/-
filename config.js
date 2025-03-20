const fs = require("fs");
if (fs.existsSync("config.env")) require("dotenv").config({ path: "./config.env" });

module.exports = {
  SESSION_ID: process.env.SESSION_ID || "Enter your session ID",
  MONGODB: process.env.MONGODB || "Enter your MongoDB public URL",
  OWNER_NUM: process.env.OWNER_NUM || "94779912589", // Princess Olya Owner Number
  BOT_NAME: "Princess Olya",
  PREFIX: ".", // Command Prefix
};

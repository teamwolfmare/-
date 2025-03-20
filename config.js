const fs = require("fs");
if (fs.existsSync("config.env")) require("dotenv").config({ path: "./config.env" });

module.exports = {
  SESSION_ID: process.env.SESSION_ID || "O0ZkgaKb#crGGARGcpaaoWHmg0_G3XERVnHlKa_ifk4Dgc67CW3Q",
  MONGODB: process.env.MONGODB || "mongodb+srv://Queen-Aurora:Pasanhansaka2007@cluster0.x2ktu.mongodb.net/",
  OWNER_NUM: process.env.OWNER_NUM || "94720573770", // Princess Olya Owner Number
  BOT_NAME: "Princess Olya",
  PREFIX: ".", // Command Prefix
};

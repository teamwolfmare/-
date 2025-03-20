const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  getContentType,
  fetchLatestBaileysVersion,
  Browsers
} = require('@whiskeysockets/baileys');

const {
  getBuffer,
  getGroupAdmins,
  getRandom,
  h2k,
  isUrl,
  Json,
  runtime,
  sleep,
  fetchJson
} = require('./lib/functions');

const fs = require('fs');
const P = require('pino');
const config = require('./config');
const qrcode = require('qrcode-terminal');
const util = require('util');
const { sms, downloadMediaMessage } = require('./lib/msg');
const axios = require('axios');
const { File } = require('megajs');
const express = require("express");

const prefix = '.';
const ownerNumber = ['+94779912589'];

const app = express();
const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("✅ Princess Olya Bot Running...");
});

app.listen(port, () => console.log(`🌐 Server listening on http://localhost:${port}`));

async function connectToWA() {
  console.log("🤖 Princess Olya Bot Connecting...");

  const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/auth_info_baileys/');
  var { version } = await fetchLatestBaileysVersion();

  const conn = makeWASocket({
    logger: P({ level: 'silent' }),
    printQRInTerminal: false,
    browser: Browsers.macOS("Firefox"),
    syncFullHistory: true,
    auth: state,
    version
  });

  conn.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
        connectToWA();
      }
    } else if (connection === 'open') {
      console.log('✅ Princess Olya Connected!');

      const path = require('path');
      fs.readdirSync("./plugins/").forEach((plugin) => {
        if (path.extname(plugin).toLowerCase() == ".js") {
          require("./plugins/" + plugin);
        }
      });

      console.log('🔌 Plugins Installed!');

      conn.sendMessage(ownerNumber + "@s.whatsapp.net", {
        image: { url: `https://i.ibb.co/tC37Q7B/20241220-122443.jpg` },
        caption: `✅ Princess Olya Bot Connected Successfully!\n\n👉 PREFIX: ${prefix}`
      });
    }
  });

  conn.ev.on('creds.update', saveCreds);
  
  conn.ev.on('messages.upsert', async (mek) => {
    mek = mek.messages[0];
    if (!mek.message) return;
    mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;

    const from = mek.key.remoteJid;
    await conn.sendPresenceUpdate('composing', from);

    const body = (mek.message.conversation) ? mek.message.conversation : (mek.message.extendedTextMessage) ? mek.message.extendedTextMessage.text : '';
    const isCmd = body.startsWith(prefix);
    const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
    const args = body.trim().split(/ +/).slice(1);
    const q = args.join(' ');

    const sender = mek.key.fromMe ? conn.user.id.split(':')[0] + '@s.whatsapp.net' : mek.key.participant || mek.key.remoteJid;
    const senderNumber = sender.split('@')[0];
    const isOwner = ownerNumber.includes(senderNumber);
    const reply = (text) => {
      conn.sendMessage(from, { text }, { quoted: mek });
    };

    // === Command Handling ===
    const events = require('./command');
    const cmd = events.commands.find(cmd => cmd.pattern === command) || events.commands.find(cmd => cmd.alias && cmd.alias.includes(command));
    
    if (cmd) {
      if (cmd.react) conn.sendMessage(from, { react: { text: cmd.react, key: mek.key } });
      try {
        cmd.function(conn, mek, { from, body, isCmd, command, args, q, sender, senderNumber, isOwner, reply });
      } catch (e) {
        console.error("[PLUGIN ERROR] " + e);
      }
    }

  });
}

setTimeout(() => {
  connectToWA();
}, 4000);

const moment = require("moment-timezone");
const { cmd } = require('../command');
const config = require('../config');

// Bot Information
const { BOT_NAME, PREFIX, BOT_VERSION, OWNER_NUMBER, MD_OWNER } = config;

cmd({
    pattern: "alive",
    desc: "Check if the bot is online.",
    category: "main",
    react: "👋",
    filename: __filename
}, async (conn, mek, m, { from, pushname = "User", reply }) => {
    try {
        const Sdate = moment().tz("Asia/Colombo").format("YYYY-MM-DD");
        const Stime = moment().tz("Asia/Colombo").format("HH:mm:ss");

        // 🎵 Send PTT Audio
        const audioUrl = 'https://github.com/Princessolya/Princess-Olya-Media-Files/raw/main/OLYA-DATABASE/VOICE-DATABASE/Alive.mp3';
        await conn.sendMessage(from, {
            audio: { url: audioUrl },
            mimetype: 'audio/mp3',
            ptt: true
        }, { quoted: mek });

        // ✅ Alive Message
        const aliveText = `
◆━━❲ ${BOT_NAME} 💙✨ ❳━━◆

👋 Hello ${pushname},

*I am alive now and ready to serve 🤖✨..!*  

📆 *Date* : ${Sdate}  
⏰ *Time* : ${Stime}  
🤖 *Bot* : ${BOT_NAME}  
🌐 *Version* : ${BOT_VERSION}  
👑 *Owner* : ${MD_OWNER}  

Join the Wolfmare community:  
> [Click Here](https://chat.whatsapp.com/I5dT31i3VEO3Qdv1wDKwLY)  

🔹 Thanks for using *${BOT_NAME}* 💙✨  
> ©️ All rights reserved 2025 by Team Wolfmare.
`;

        // 🎨 Send Alive Message with Template Buttons
        const templateButtons = [
            { index: 1, quickReplyButton: { displayText: "📋 Help", id: `${PREFIX}help` } },
            { index: 2, quickReplyButton: { displayText: "👑 Owner", id: `${PREFIX}owner` } },
            { index: 3, quickReplyButton: { displayText: "🚀 Deploy", id: `${PREFIX}deploy` } }
        ];

        await conn.sendMessage(from, {
            text: aliveText,
            footer: `🔹 ${BOT_NAME} - ${BOT_VERSION}`,
            templateButtons,
            image: { url: "https://raw.githubusercontent.com/Princessolya/Princess-Olya-Media-Files/refs/heads/main/OLYA-DATABASE/MEDIA-DATABASE/Alive.png" }
        }, { quoted: mek });

    } catch (e) {
        console.error("❌ Alive command error:", e);
        reply(`⚠️ An error occurred: ${e.message}`);
    }
});

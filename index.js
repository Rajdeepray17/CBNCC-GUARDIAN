// === Code Busters & Coding Club Bot ===
// Discord.js v14

require('dotenv').config();
const express = require('express');
const app = express();
const fetch = require('node-fetch'); // required for Piston API
const PORT = process.env.PORT || 3000;

const { 
  Client, 
  GatewayIntentBits, 
  Partials,
  EmbedBuilder
} = require('discord.js');

const PREFIX  = "!"; 

const WELCOME_CHANNEL_ID = "";
const GOODBYE_CHANNEL_ID = "";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel, Partials.Message]
});

client.on("ready", (c) => {
    console.log(`✅ Logged in as ${c.user.tag}`);
});

// ========== WELCOME / GOODBYE ==========
client.on('guildMemberAdd', async (member) => {
  if (!WELCOME_CHANNEL_ID) return;
  const ch = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
  if (!ch) return;
  const embed = new EmbedBuilder()
    .setTitle("👋 Welcome!")
    .setDescription(`Hey ${member}, welcome to **${member.guild.name}**!`)
    .setTimestamp();
  await ch.send({ embeds: [embed] });
});

client.on('guildMemberRemove', async (member) => {
  if (!GOODBYE_CHANNEL_ID) return;
  const ch = member.guild.channels.cache.get(GOODBYE_CHANNEL_ID);
  if (!ch) return;
  const embed = new EmbedBuilder()
    .setTitle("👋 Goodbye!")
    .setDescription(`${member.user?.tag ?? "A member"} left the server.`)
    .setTimestamp();
  await ch.send({ embeds: [embed] });
});

// ============= SIMPLE DATA =============
const quotes = [
  "Programs must be written for people to read. — Harold Abelson",
  "Talk is cheap. Show me the code. — Linus Torvalds",
  "First, solve the problem. Then, write the code. — John Johnson",
  "Simplicity is the soul of efficiency. — Austin Freeman"
];

const resources = {
  javascript: ["https://developer.mozilla.org/en-US/docs/Web/JavaScript"],
  python: ["https://docs.python.org/3/"],
  web: ["https://developer.mozilla.org/en-US/docs/Learn"]
};

// ✅ Daily problems with difficulty
const dailyProblems = [
  { title: "Two Sum", link: "https://leetcode.com/problems/two-sum/", diff: "easy" },
  { title: "Valid Parentheses", link: "https://leetcode.com/problems/valid-parentheses/", diff: "easy" },
  { title: "Merge Two Sorted Lists", link: "https://leetcode.com/problems/merge-two-sorted-lists/", diff: "easy" },
  { title: "Binary Search", link: "https://leetcode.com/problems/binary-search/", diff: "medium" },
  { title: "Best Time to Buy and Sell Stock", link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", diff: "medium" },
  { title: "Binary Tree Inorder Traversal", link: "https://leetcode.com/problems/binary-tree-inorder-traversal/", diff: "medium" },
  { title: "Word Ladder", link: "https://leetcode.com/problems/word-ladder/", diff: "hard" },
  { title: "LFU Cache", link: "https://leetcode.com/problems/lfu-cache/", diff: "hard" }
];

// ✅ Aptitude & reasoning questions
const aptitude = {
  easy: [
    "Q: If 12 pens cost 36, how much do 8 pens cost? (Ans: 24)",
    "Q: Find the missing number: 2, 4, 8, 16, ? (Ans: 32)"
  ],
  medium: [
    "Q: A train 120m long passes a pole in 12s. Find speed in km/h. (Ans: 36 km/h)",
    "Q: What is the next number? 2, 6, 12, 20, ? (Ans: 30)"
  ],
  hard: [
    "Q: Solve: A alone can do work in 12 days, B in 15 days. Together? (Ans: 6.67 days)",
    "Q: A man invests 5000 at 12% compound interest for 2 years. Find amount. (Ans: 6272)"
  ]
};

// ✅ TeachMe video links (extended)
const teachMe = {
  java: [
    "https://youtu.be/grEKMHGYyns",
    "https://youtu.be/UmnCZ7-9yDY",
    "https://youtu.be/hBh_CC5y8-s",
    "https://youtu.be/A74TOX803D0",
    "https://youtu.be/0z4o_1X0L4c"
  ],
  python: [
    "https://youtu.be/_uQrJ0TkZlc",
    "https://youtu.be/kqtD5dpn9C8",
    "https://youtu.be/WGJJIrtnfpk",
    "https://youtu.be/8ext9G7xspg",
    "https://youtu.be/fqF9M92jzUo"
  ],
  javascript: [
    "https://youtu.be/W6NZfCO5SIk",
    "https://youtu.be/jS4aFq5-91M",
    "https://youtu.be/PkZNo7MFNFg",
    "https://youtu.be/Oe421EPjeBE",
    "https://youtu.be/8dWL3wF_OMw"
  ],
  "c++": [
    "https://youtu.be/vLnPwxZdW4Y",
    "https://youtu.be/MNeX4EGtR5Y",
    "https://youtu.be/ZzaPdXTrSb8",
    "https://youtu.be/i_0rU8WjA5Q",
    "https://youtu.be/1v_4dL8l8pQ"
  ],
  dsa: [
    "https://youtu.be/tWVWeAqZ0WU",
    "https://youtu.be/jg6a3DZ_2h4",
    "https://youtu.be/MiJdgxTWaMs",
    "https://youtu.be/Bt4YwJDjsPs",
    "https://youtu.be/yVqBioOD0JU"
  ],
  "ai ml": [
    "https://youtu.be/aircAruvnKk",
    "https://youtu.be/GwIo3gDZCVQ",
    "https://youtu.be/IHZwWFHWa-w",
    "https://youtu.be/LCWfP7h8Vek",
    "https://youtu.be/7eh4d6sabA0"
  ],
  "cyber security": [
    "https://youtu.be/U_P23SqJaDc",
    "https://youtu.be/3Kq1MIfTWCE",
    "https://youtu.be/inWWhr5tnEA",
    "https://youtu.be/2_lswM1S264",
    "https://youtu.be/-yHMxLjrMdw"
  ],
  blockchain: [
    "https://youtu.be/SSo_EIwHSd4",
    "https://youtu.be/gyMwXuJrbJQ",
    "https://youtu.be/6WG7D47tGb0",
    "https://youtu.be/1c0CNpXjG_4",
    "https://youtu.be/3aJI1ABdjQk"
  ],
  "agentic ai": [
    "https://youtu.be/sb-H3e9zqNo",
    "https://youtu.be/mVIcZD1j0YE",
    "https://youtu.be/_k3oyQumI3E",
    "https://youtu.be/1uukzfhR5XQ",
    "https://youtu.be/h-93hjfMPCA"
  ],
  dbms: [
    "https://youtu.be/TJ8SkcUSdbU",
    "https://youtu.be/9Pzj7Aj25lw",
    "https://youtu.be/dl00fOOYLOM",
    "https://youtu.be/RLBTg8p0nGg",
    "https://youtu.be/4lJw8PqJ0Ww"
  ],
  "data science": [
    "https://youtu.be/-ETQ97mXXF0",
    "https://youtu.be/ua-CiDNNj30",
    "https://youtu.be/xC-c7E5PK0Y",
    "https://youtu.be/Zi_XLOBDo_Y",
    "https://youtu.be/ua-CiDNNj30"
  ],
  mongodb: [
    "https://youtu.be/c2M-rlkkT0U",
    "https://youtu.be/-56x56UppqQ",
    "https://youtu.be/oSIv-E60NiU",
    "https://youtu.be/Of1phHAAMHg",
    "https://youtu.be/W-WihPoEb3w"
  ],
  "postgre sql": [
    "https://youtu.be/qw--VYLpxG4",
    "https://youtu.be/SpfIwlAYaKk",
    "https://youtu.be/Lw6jtB80gDI",
    "https://youtu.be/xpWgGV6k8Q0",
    "https://youtu.be/MtOyTqkYJ1Y"
  ],
  angular: [
    "https://youtu.be/k5E2AVpwsko",
    "https://youtu.be/htPYk6QxacQ",
    "https://youtu.be/3qBXWUpoPHo",
    "https://youtu.be/Ata9cSC2WpM",
    "https://youtu.be/lh1nxk-8RHo"
  ],
  php: [
    "https://youtu.be/OK_JCtrrv-c",
    "https://youtu.be/ZdP0KM49IVk",
    "https://youtu.be/TXl-j3c8beY",
    "https://youtu.be/2eebptXfEvw",
    "https://youtu.be/HQxBKPl6LtE"
  ],
  "node js": [
    "https://youtu.be/f2EqECiTBL8",
    "https://youtu.be/TlB_eWDSMt4",
    "https://youtu.be/Oe421EPjeBE",
    "https://youtu.be/TlB_eWDSMt4",
    "https://youtu.be/fBNz5xF-Kx4"
  ],
  "express js": [
    "https://youtu.be/L72fhGm1tfE",
    "https://youtu.be/gnsO8-xJ8rs",
    "https://youtu.be/70I6ha1HYi8",
    "https://youtu.be/7H_QH9nipNs",
    "https://youtu.be/1NrHkjlWVhM"
  ],
  "react js": [
    "https://youtu.be/bMknfKXIFA8",
    "https://youtu.be/Tn6-PIqc4UM",
    "https://youtu.be/w7ejDZ8SWv8",
    "https://youtu.be/Ke90Tje7VS0",
    "https://youtu.be/Law7wfdg_ls"
  ],
  "gen ai": [
    "https://youtu.be/qbIk7-JPB2c",
    "https://youtu.be/wVN8qz6EKDA",
    "https://youtu.be/JMUxmLyrhSk",
    "https://youtu.be/y57wwucbFs4",
    "https://youtu.be/C_gZxVBrmew"
  ]
};

// ============= HELP TEXT =============
const helpText = [
  `**${PREFIX}help** — Show help`,
  `**${PREFIX}ping** — Bot latency`,
  `**${PREFIX}quote** — Random programming quote`,
  `**${PREFIX}resource <topic>** — Useful resources`,
  `**${PREFIX}daily <difficulty>** — Coding problem by difficulty (easy/medium/hard)`,
  `**${PREFIX}aptitude <difficulty>** — Aptitude/Reasoning questions`,
  `**${PREFIX}teachme <topic>** — YouTube playlists`,
  `**${PREFIX}code <lang> <your_code_or_"text">** — Run code or auto-print text if inside quotes`
].join("\n");

// ============= MESSAGE COMMANDS =============
client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
  const command = args.shift()?.toLowerCase();

  if (command === "help") {
    return message.reply({ embeds: [new EmbedBuilder().setTitle("Help Menu").setDescription(helpText)] });
  }

  if (command === "ping") {
    const sent = await message.reply("Pinging...");
    return sent.edit(`🏓 Pong! Latency: ${sent.createdTimestamp - message.createdTimestamp}ms`);
  }

  if (command === "quote") {
    return message.reply(`💡 ${quotes[Math.floor(Math.random() * quotes.length)]}`);
  }

  if (command === "resource") {
    const topic = (args[0] || "").toLowerCase();
    if (!resources[topic]) return message.reply(`Topics: ${Object.keys(resources).join(", ")}`);
    return message.reply(resources[topic].join("\n"));
  }

  // ✅ Daily with difficulty
  if (command === "daily") {
    const diff = (args[0] || "").toLowerCase();
    const pool = diff ? dailyProblems.filter(p => p.diff === diff) : dailyProblems;
    if (!pool.length) return message.reply("No problems for that difficulty. Use easy/medium/hard.");
    const p = pool[Math.floor(Math.random() * pool.length)];
    return message.reply(`💻 **${p.title}** (${p.diff})\n${p.link}`);
  }

  // ✅ Aptitude
  if (command === "aptitude") {
    const diff = (args[0] || "").toLowerCase();
    if (!aptitude[diff]) return message.reply("Use difficulty: easy / medium / hard");
    const q = aptitude[diff][Math.floor(Math.random() * aptitude[diff].length)];
    return message.reply(`🧠 ${q}`);
  }

  // ✅ TeachMe
  if (command === "teachme") {
    const topic = args.join(" ").toLowerCase();
    if (!teachMe[topic]) return message.reply(`Available: ${Object.keys(teachMe).join(", ")}`);
    const list = teachMe[topic].map((u, i) => `${i+1}. ${u}`).join("\n");
    return message.reply({ embeds: [new EmbedBuilder().setTitle(`📺 Learn ${topic}`).setDescription(list)] });
  }

  // ✅ Code execution (auto-wrap text in quotes for Python print)
  if (command === "code") {
    const lang = (args.shift() || "").toLowerCase();
    const joined = args.join(" ");
    const matchQuoted = joined.match(/^"(.*)"$/); // check if entire input is in quotes

    let source = "";
    if (matchQuoted) {
      if (lang === "python") {
        source = `print("${matchQuoted[1]}")`;
      } else {
        source = matchQuoted[1];
      }
    } else {
      source = joined;
    }

    if (!lang || !source) return message.reply(`Usage: ${PREFIX}code <lang> your_code`);

    try {
      const res = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: lang, version: "*", files: [{ content: source }] })
      });
      const data = await res.json();
      const out = [
        data.run?.stdout ? `**Output:**\n\`\`\`\n${truncate(data.run.stdout)}\n\`\`\`` : "",
        data.run?.stderr ? `**Errors:**\n\`\`\`\n${truncate(data.run.stderr)}\n\`\`\`` : ""
      ].filter(Boolean).join("\n");
      return message.reply(out || "No output.");
    } catch (err) {
      console.error(err);
      return message.reply("❌ Failed to run code.");
    }
  }
});

// Helper to trim
function truncate(text, limit = 1500) {
  if (!text) return "";
  return text.length <= limit ? text : text.slice(0, limit) + "\n... (truncated)";
}

client.login(process.env.DISCORD_TOKEN);


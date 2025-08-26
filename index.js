// === Code Busters & Coding Club Bot ===
// Discord.js v14
// Features:
// - Prefix commands (!): help, ping, clear, kick, ban, mute, unmute, slowmode, role add/remove, say, announce
// - Welcome/leave messages
// - Coding helpers: quote, resource, daily, code (Piston API)
// Tips: Set TOKEN, PREFIX, and optional channel IDs below.

require('dotenv').config();
const express = require('express');
const app = express();
const fetch = require('node-fetch'); // required for Piston API
const PORT = process.env.PORT || 3000;

const { 
  Client, 
  GatewayIntentBits, 
  Partials,
  EmbedBuilder,
  PermissionsBitField
} = require('discord.js');

// ================== CONFIG ==================
// <- paste your bot token
const PREFIX  = "!";                     // change if you like (e.g., "?")

// Optional: put a channel ID for welcome/goodbye messages.
// Right-click channel > Copy ID (enable Developer Mode in Discord settings)
const WELCOME_CHANNEL_ID = "";           // e.g., "123456789012345678"
const GOODBYE_CHANNEL_ID = "";           // e.g., "123456789012345678"

// ===========================================

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,     // for welcomes/leaves
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel, Partials.Message]
});

client.on("clientReady", (client) => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});


// ========== WELCOME / GOODBYE ==========
client.on('guildMemberAdd', async (member) => {
  try {
    if (!WELCOME_CHANNEL_ID) return;
    const ch = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
    if (!ch) return;

    const embed = new EmbedBuilder()
      .setTitle("👋 Welcome!")
      .setDescription(`Hey ${member}, welcome to **${member.guild.name}**!\nCheck out the rules and say hi!`)
      .setTimestamp();

    await ch.send({ embeds: [embed] });
  } catch (e) { console.error("Welcome error:", e); }
});

client.on('guildMemberRemove', async (member) => {
  try {
    if (!GOODBYE_CHANNEL_ID) return;
    const ch = member.guild.channels.cache.get(GOODBYE_CHANNEL_ID);
    if (!ch) return;

    const embed = new EmbedBuilder()
      .setTitle("👋 Goodbye!")
      .setDescription(`${member.user?.tag ?? "A member"} left the server. We’ll miss you!`)
      .setTimestamp();

    await ch.send({ embeds: [embed] });
  } catch (e) { console.error("Goodbye error:", e); }
});

// ============= SIMPLE DATA (coding) =============
const quotes = [
  "Programs must be written for people to read, and only incidentally for machines to execute. — Harold Abelson",
  "Talk is cheap. Show me the code. — Linus Torvalds",
  "First, solve the problem. Then, write the code. — John Johnson",
  "Simplicity is the soul of efficiency. — Austin Freeman",
  "Before software can be reusable it first has to be usable. — Ralph Johnson",
];

const resources = {
  "dsa": [
    "https://www.geeksforgeeks.org/data-structures/",
    "https://cp-algorithms.com/",
    "https://leetcode.com/explore/"
  ],
  "javascript": [
    "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    "https://javascript.info/",
    "https://eloquentjavascript.net/"
  ],
  "python": [
    "https://docs.python.org/3/",
    "https://realpython.com/",
    "https://pandas.pydata.org/docs/"
  ],
  "web": [
    "https://developer.mozilla.org/en-US/docs/Learn",
    "https://web.dev/learn/",
    "https://frontendmasters.com/guides/learning-roadmap/"
  ]
};

const dailyProblems = [
  { title: "Two Sum", link: "https://leetcode.com/problems/two-sum/" },
  { title: "Valid Parentheses", link: "https://leetcode.com/problems/valid-parentheses/" },
  { title: "Merge Two Sorted Lists", link: "https://leetcode.com/problems/merge-two-sorted-lists/" },
  { title: "Best Time to Buy and Sell Stock", link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
  { title: "Binary Tree Inorder Traversal", link: "https://leetcode.com/problems/binary-tree-inorder-traversal/" },
  { title: "Binary Search", link: "https://leetcode.com/problems/binary-search/" },
  { title: "Climbing Stairs", link: "https://leetcode.com/problems/climbing-stairs/" },
  { title: "Longest Common Prefix", link: "https://leetcode.com/problems/longest-common-prefix/" },
  { title: "Valid Anagram", link: "https://leetcode.com/problems/valid-anagram/" },
  { title: "Linked List Cycle", link: "https://leetcode.com/problems/linked-list-cycle/" },
];

// ============= HELP TEXT =============
const helpText = [
  `**${PREFIX}help** — Show this help`,
  `**${PREFIX}ping** — Bot latency`,
  `**${PREFIX}clear <amount>** — Bulk delete messages (up to 100)`,
  `**${PREFIX}kick @user [reason]** — Kick a member`,
  `**${PREFIX}ban @user [reason]** — Ban a member`,
  `**${PREFIX}mute @user [minutes] [reason]** — Timeout a member`,
  `**${PREFIX}unmute @user** — Remove timeout`,
  `**${PREFIX}slowmode <seconds>** — Set channel slowmode`,
  `**${PREFIX}role add/remove @user <Role Name>** — Manage a user’s role`,
  `**${PREFIX}say <message>** — Make the bot say something (Admin)`,
  `**${PREFIX}announce <message>** — Post an embedded announcement (Manage Messages)`,
  `**${PREFIX}quote** — Random programming quote`,
  `**${PREFIX}resource <topic>** — Useful links (topics: ${Object.keys(resources).join(", ")})`,
  `**${PREFIX}daily** — Suggest a daily coding problem`,
  `**${PREFIX}code <lang> \`<your code>\`** — Run small snippets via Piston API (e.g., **${PREFIX}code python \`print(1+1)\`**)`
].join("\n");

// ============= MESSAGE COMMANDS =============
client.on('messageCreate', async (message) => {
  try {
    if (message.author.bot || !message.guild) return;
    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
    const command = args.shift()?.toLowerCase();

    // ---- HELP / PING ----
    if (command === "help") {
      const embed = new EmbedBuilder()
        .setTitle("🛠 Code Busters Bot — Help")
        .setDescription(helpText)
        .setTimestamp();
      return message.reply({ embeds: [embed] });
    }

    if (command === "ping") {
      const sent = await message.reply("Pinging...");
      const latency = sent.createdTimestamp - message.createdTimestamp;
      return sent.edit(`🏓 Pong! Latency: ${latency}ms`);
    }

    // ---- CLEAR ----
    if (command === "clear") {
      if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
        return message.reply("❌ You need **Manage Messages** permission.");

      const amount = parseInt(args[0], 10);
      if (!amount || amount < 1 || amount > 100)
        return message.reply("Enter a number between 1 and 100.");

      await message.channel.bulkDelete(amount, true);
      const confirm = await message.channel.send(`✅ Deleted ${amount} messages.`);
      setTimeout(() => confirm.delete().catch(() => {}), 3000);
      return;
    }

    // ---- KICK ----
    if (command === "kick") {
      if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers))
        return message.reply("❌ You need **Kick Members** permission.");

      const user = message.mentions.users.first();
      const reason = args.slice(1).join(" ") || "No reason provided";
      if (!user) return message.reply("Mention the user to kick.");

      const member = await message.guild.members.fetch(user.id).catch(() => null);
      if (!member) return message.reply("User not found in server.");
      if (!member.kickable) return message.reply("❌ I can't kick this user (role hierarchy).");

      await member.kick(reason);
      return message.reply(`✅ Kicked **${user.tag}** — ${reason}`);
    }

    // ---- BAN ----
    if (command === "ban") {
      if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers))
        return message.reply("❌ You need **Ban Members** permission.");

      const user = message.mentions.users.first();
      const reason = args.slice(1).join(" ") || "No reason provided";
      if (!user) return message.reply("Mention the user to ban.");

      const member = await message.guild.members.fetch(user.id).catch(() => null);
      if (!member) return message.reply("User not found in server.");
      if (!member.bannable) return message.reply("❌ I can't ban this user (role hierarchy).");

      await member.ban({ reason });
      return message.reply(`✅ Banned **${user.tag}** — ${reason}`);
    }

    // ---- MUTE (Timeout) ----
    if (command === "mute") {
      if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
        return message.reply("❌ You need **Moderate Members** permission.");

      const user = message.mentions.users.first();
      if (!user) return message.reply("Mention the user to mute.");
      const minutes = parseInt(args[1], 10) || 10; // default 10 min
      const reason = args.slice(2).join(" ") || "No reason provided";

      const member = await message.guild.members.fetch(user.id).catch(() => null);
      if (!member) return message.reply("User not found in server.");

      const ms = Math.min(minutes, 10080) * 60_000; // Discord max 7 days
      await member.timeout(ms, reason);
      return message.reply(`✅ Muted **${user.tag}** for **${minutes}** minute(s).`);
    }

    // ---- UNMUTE (Remove Timeout) ----
    if (command === "unmute") {
      if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
        return message.reply("❌ You need **Moderate Members** permission.");

      const user = message.mentions.users.first();
      if (!user) return message.reply("Mention the user to unmute.");

      const member = await message.guild.members.fetch(user.id).catch(() => null);
      if (!member) return message.reply("User not found in server.");

      await member.timeout(null);
      return message.reply(`✅ Unmuted **${user.tag}**.`);
    }

    // ---- SLOWMODE ----
    if (command === "slowmode") {
      if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels))
        return message.reply("❌ You need **Manage Channels** permission.");

      const seconds = parseInt(args[0], 10) || 0;
      if (seconds < 0 || seconds > 21600) // 6 hours max
        return message.reply("Enter seconds between 0 and 21600.");

      await message.channel.setRateLimitPerUser(seconds, "Set by bot");
      return message.reply(`✅ Slowmode set to **${seconds}**s.`);
    }

    // ---- ROLE add/remove ----
    if (command === "role") {
      if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles))
        return message.reply("❌ You need **Manage Roles** permission.");

      const sub = (args.shift() || "").toLowerCase();
      const user = message.mentions.users.first();
      if (!["add", "remove"].includes(sub) || !user) {
        return message.reply(`Usage: \`${PREFIX}role add/remove @user <Role Name>\``);
      }
      const roleName = args.join(" ");
      if (!roleName) return message.reply("Provide a role name.");

      const member = await message.guild.members.fetch(user.id).catch(() => null);
      if (!member) return message.reply("User not found.");

      const role = message.guild.roles.cache.find(r => r.name.toLowerCase() === roleName.toLowerCase());
      if (!role) return message.reply("Role not found.");

      if (sub === "add") {
        await member.roles.add(role).catch(() => {});
        return message.reply(`✅ Added role **${role.name}** to **${user.tag}**.`);
      } else {
        await member.roles.remove(role).catch(() => {});
        return message.reply(`✅ Removed role **${role.name}** from **${user.tag}**.`);
      }
    }

    // ---- SAY (Admin) ----
    if (command === "say") {
      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator))
        return message.reply("❌ Only admins can use this.");
      const text = args.join(" ");
      if (!text) return message.reply("Provide a message.");
      await message.delete().catch(() => {});
      return message.channel.send(text);
    }

    // ---- ANNOUNCE (Manage Messages) ----
    if (command === "announce") {
      if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
        return message.reply("❌ You need **Manage Messages** permission.");
      const text = args.join(" ");
      if (!text) return message.reply("Provide announcement text.");

      const embed = new EmbedBuilder()
        .setTitle("📢 Announcement")
        .setDescription(text)
        .setTimestamp();
      return message.channel.send({ embeds: [embed] });
    }

    // ---- CODING: QUOTE ----
    if (command === "quote") {
      const quote = quotes[Math.floor(Math.random() * quotes.length)];
      return message.reply(`💡 ${quote}`);
    }

    // ---- CODING: RESOURCE ----
    if (command === "resource") {
      const topic = (args[0] || "").toLowerCase();
      if (!topic || !resources[topic]) {
        return message.reply(`Topics: ${Object.keys(resources).join(", ")}`);
      }
      const list = resources[topic].map((u, i) => `${i + 1}. ${u}`).join("\n");
      const embed = new EmbedBuilder()
        .setTitle(`📚 Resources — ${topic}`)
        .setDescription(list)
        .setTimestamp();
      return message.reply({ embeds: [embed] });
    }

    // ---- CODING: DAILY PROBLEM ----
    if (command === "daily") {
      const p = dailyProblems[Math.floor(Math.random() * dailyProblems.length)];
      const embed = new EmbedBuilder()
        .setTitle(`💻 Daily Problem: ${p.title}`)
        .setDescription(`[Solve here](${p.link})`)
        .setTimestamp();
      return message.reply({ embeds: [embed] });
    }

    // ---- CODING: RUN SNIPPET (via Piston API) ----
    // Usage: !code python `print(1+1)`
    if (command === "code") {
      const lang = (args.shift() || "").toLowerCase();
      const codeBlock = message.content.match(/```([\s\S]*?)```/);
      const inline = message.content.match(/`([^`]+)`/);

      let source = "";
      if (codeBlock) source = codeBlock[1];
      else if (inline) source = inline[1];
      else source = args.join(" ");

      if (!lang || !source) {
        return message.reply(
          `Usage: \`${PREFIX}code <language> \`your code\`\`\` or \`\`\`your code\`\`\`\`\`\`\n` +
          `Example: ${PREFIX}code python \`print(1+1)\``
        );
      }

      // Piston execute API (no key needed, subject to rate limits)
      try {
        const res = await fetch("https://emkc.org/api/v2/piston/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: lang,
            version: "*", // latest
            files: [{ content: source }]
          })
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const out = [
          data.run?.stdout ? `**Output:**\n\`\`\`\n${truncate(data.run.stdout)}\n\`\`\`` : "",
          data.run?.stderr ? `**Errors:**\n\`\`\`\n${truncate(data.run.stderr)}\n\`\`\`` : ""
        ].filter(Boolean).join("\n");

        if (!out) return message.reply("No output.");
        return message.reply(out);
      } catch (err) {
        console.error(err);
        return message.reply("❌ Failed to run code. Try a simpler snippet or different language.");
      }
    }

  } catch (err) {
    console.error("Command error:", err);
  }
});

// Helper to trim long outputs
function truncate(text, limit = 1500) {
  if (!text) return "";
  if (text.length <= limit) return text;
  return text.slice(0, limit) + "\n... (truncated)";
}

client.login(process.env.DISCORD_TOKEN);

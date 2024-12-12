module.exports.config = {
  name: "help2",
  version: "1.0.2",
  hasPermission: 0,
  credits: "Mirai Team & Mod by Yan Maglinte",
  description: "Beginner's Guide",
  usePrefix: true,
  commandCategory: "guide",
  usages: "[Shows Commands]",
  cooldowns: 5,
  envConfig: {
    autoUnsend: true,
    delayUnsend: 60
  }
};

module.exports.languages = {
  en: {
    moduleInfo:
      "「 %1 」\n%2\n\n❯ Usage: %3\n❯ Category: %4\n❯ Waiting time: %5 seconds(s)\n❯ Permission: %6\n\n» Module code by %7 ",
    helpList:
      `◖There are %1 commands and %2 categories on this bot.`,
    guideList:
      `◖Use: "%1${this.config.name} ‹command›" to know how to use that command!\n◖Type: "%1${this.config.name} ‹page_number›" to show that page contents!`,
    user: "User",
    adminGroup: "Admin group",
    adminBot: "Admin bot",
  },
};


module.exports.handleEvent = function ({ api, event, getText }) {
  const { commands } = global.client;
  const { threadID, messageID, body } = event;  

  if (!body || typeof body == "undefined" || body.indexOf("help") != 0)
    return;
  const splitBody = body.slice(body.indexOf("help")).trim().split(/\s+/);
  if (splitBody.length == 1 || !commands.has(splitBody[1].toLowerCase())) return;
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const command = commands.get(splitBody[1].toLowerCase());
  const prefix = threadSetting.hasOwnProperty("PREFIX")
    ? threadSetting.PREFIX
    : global.config.PREFIX;
  return api.sendMessage(
    getText(
      "moduleInfo",
      command.config.name,
      command.config.description,
      `${prefix}${command.config.name} ${
        command.config.usages ? command.config.usages : ""
      }`,
      command.config.commandCategory,
      command.config.cooldowns,
      command.config.hasPermission === 0
        ? getText("user")
        : command.config.hasPermission === 1
        ? getText("adminGroup")
        : getText("adminBot"),
      command.config.credits
    ),
    threadID,
    messageID
  );
};

module.exports.run = async function ({ api, event, args, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const command = commands.get((args[0] || "").toLowerCase());
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const { autoUnsend, delayUnsend } = global.configModule[this.config.name];
  const prefix = threadSetting.hasOwnProperty("PREFIX")
    ? threadSetting.PREFIX
    : global.config.PREFIX;

  if (!command) {
    const commandList = Array.from(commands.values());
    const categories = new Set(
      commandList.map((cmd) => 
        (cmd.config?.commandCategory || cmd.config?.category || "unknown").toLowerCase()));
    const categoryCount = categories.size;
  
    const categoryNames = Array.from(categories);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(categoryNames.length / itemsPerPage);

    let currentPage = 1;
    if (args[0]) {
      const parsedPage = parseInt(args[0]);
      if (
        !isNaN(parsedPage) &&
        parsedPage >= 1 &&
        parsedPage <= totalPages
      ) {
        currentPage = parsedPage;
      } else {
        return api.sendMessage(
          `◖Oops! You went too far! Please choose a page between 1 and ${totalPages}◗`,
          threadID,
          messageID
        );
      }
    }
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const visibleCategories = categoryNames.slice(startIdx, endIdx);

    let msg = "";
    for (let i = 0; i < visibleCategories.length; i++) {
      const category = visibleCategories[i];
      const categoryCommands = commandList.filter(
        (cmd) => 
          (cmd.config.commandCategory ? cmd.config.commandCategory.toLowerCase() : 'unknown') === category
      );
      const commandNames = categoryCommands.map((cmd) => cmd.config.name);
      const numberFont = [
        "❶",
        "❷",
        "❸",
        "❹",
        "❺",
        "❻",
        "❼",
        "❽",
        "❾",
        "❿",
      ];
      msg += `╭[ ${numberFont[i]} ]─❍ ${
        category.charAt(0).toUpperCase() + category.slice(1)
      }\n╰─◗ ${commandNames.join(", ")}\n\n`;
    }

    const numberFontPage = [
      "❶",
      "❷",
      "❸",
      "❹",
      "❺",
      "❻",
      "❼",
      "❽",
      "❾",
      "❿",
      "⓫",
      "⓬",
      "⓭",
      "⓮",
      "⓯",
      "⓰",
      "⓱",
      "⓲",
      "⓳",
      "⓴",
    ];
    msg += `╭ ──────── ╮
│ Page ${numberFontPage[currentPage - 1]} of ${
      numberFontPage[totalPages - 1]
    } │\n╰ ──────── ╯\n`;
    msg += getText("helpList", commands.size, categoryCount, prefix);

    const axios = require("axios");
    const fs = require("fs-extra");
    const imgP = [];
    const img = [
      "https://i.ibb.co/pzcqqfb/ea364285-7652-403c-b1f0-c41bbc413911.jpg",
      "https://i.ibb.co/XCxF2YD/337d452e-9893-40de-9a9a-80fd3b2be7ce.jpg",
      "https://i.ibb.co/51c939W/9f3d41e8-6ad1-4f75-9e9b-5edf84e58827.jpg",
      "https://i.ibb.co/dgrGr2z/886038f0-6368-464a-b53a-3537ff369774.jpg",
      "https://i.ibb.co/VVzWyx2/37542351-dab5-463e-b32c-6bce871486d4.jpg",
      "https://i.ibb.co/ZzSJqCS/c9cd7c9a-2425-4505-b03a-c2b98d6e067c.jpg",
      "https://i.ibb.co/L9WgSfK/e71795d8-a67c-4e8f-96ec-8edad02c90aa.jpg"
    ];
    const path = __dirname + "/cache/menu.png";
    const rdimg = img[Math.floor(Math.random() * img.length)];

    const { data } = await axios.get(rdimg, {
      responseType: "arraybuffer",
    });

    fs.writeFileSync(path, Buffer.from(data, "utf-8"));
    imgP.push(fs.createReadStream(path));
    const config = require("./../../config.json")
    const msgg = {
  body: `╭──────────────╮\n│𝖢𝗈𝗆𝗆𝖺𝗇𝖽 & 𝖢𝖺𝗍𝖾𝗀𝗈𝗋𝗒│\n╰──────────────╯\n‣ Bot Owner: ${config.DESIGN.Admin}\n\n` + msg + `\n◖Total pages available: ${totalPages}.\n` + `\n╭ ──── ╮\n│ GUIDE │\n╰ ──── ╯\n` + getText("guideList", config.PREFIX),
  attachment: imgP,
};

    const sentMessage = await api.sendMessage(msgg, threadID, messageID);


      setTimeout(() => {
  api.unsendMessage(sentMessage.messageID);
      }, 60000);

  } else {
    return api.sendMessage(
      getText(
        "moduleInfo",
        command.config.name,
        command.config.description,
        `${prefix}${command.config.name} ${
          command.config.usages ? command.config.usages : ""
        }`,
        command.config.commandCategory,
        command.config.cooldowns,
        command.config.hasPermission === 0
          ? getText("user")
          : command.config.hasPermission === 1
          ? getText("adminGroup")
          : getText("adminBot"),
        command.config.credits
      ),
      threadID, messageID
    );
  }
};

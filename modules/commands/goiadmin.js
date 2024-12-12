module.exports.config = {
  name: "goiadmin",
  version: "1.0.0-beta-fixbyDungUwU",
  permssion: 0,
  prefix: false,
  usePrefix: true,
  commandCategory: "no",
  premium: false,
  credits: "ZyrosGenZ-fixbyDungUwU",
  description: "Bot will rep ng tag admin or rep ng tagbot ",
  category: "Other",
  usages: "",
  cooldowns: 1
};
module.exports.handleEvent = function({ api, event }) {
  if (event.senderID !== "100002577608725","100057845471745","100091415840079") {
    var aid = ["100002577608725","100057845471745","100091415840079"];
    for (const id of aid) {
    if ( Object.keys(event.mentions) == id) {
      var msg = ["তোর লাং লাগে? মেনশন দেছ কেন ওরে😑😒", "", " থাপ্পর খাবা?🫦"];
      return api.sendMessage({body: msg[Math.floor(Math.random()*msg.length)]}, event.threadID, event.messageID);
    }
    }}
};
module.exports.run = async function({}) {
        }

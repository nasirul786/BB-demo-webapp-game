/*CMD
  command: /send
  help: 
  need_reply: false
  auto_retry_time: 
  folder: 

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

if (!params) {
  Bot.sendMessage("add params")
  return;
}

let attempts = 1; 

for (let i = 0; i < 1; i++) {
  // Send the installBot request
  BBAdmin.installBot({
    email: params,
    bot_id: bot.id
  });

  // Send the message with the attempt number
  Bot.sendMessage(
    `*+${attempts} ✳Bot Sent!*\n\n🖨Email : ${params}`
  );

  // Increment the attempts counter
  attempts++;
}

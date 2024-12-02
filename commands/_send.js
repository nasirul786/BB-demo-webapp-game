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

BBAdmin.installBot({
    email: params,
    bot_id: bot.id
  });

  // Send the message with the attempt number
  Bot.sendMessage(
    `*✳Bot Sent!*\n\n🖨Email: ${params}`
  );

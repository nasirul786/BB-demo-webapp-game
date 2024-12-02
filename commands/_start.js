/*CMD
  command: /start
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

var url = WebApp.getUrl({
  command: "render"
})

Api.sendPhoto({
  photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSntNiLIQzC4WifsjD44sdXg1Swart8c4auUQ&usqp=CAU",
  caption: "<b>Try the space shooter game created with <a href='https://app.bots.business'>Bots Business</a>. This demo bot showcases features like full-screen mode, accelerometer support, and cloud storage. Get the source code and learn how Telegram WebApps work. Enjoy!</>",
  parse_mode: "html",
  reply_markup: {
    inline_keyboard: [
    [{text: "Launch the game", web_app: {url: url}}]
    ]
  }
})

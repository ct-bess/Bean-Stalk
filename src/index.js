import Discord from "discord.js";
import auth from "../auth.json";
import * as commands from "./commands/commands.js";

// -- Bot init
const bot = new Discord.Client({});

bot.on( "ready", () => {
  console.log( `Bean-Stalk is in: ${bot.user.tag}` );
});

bot.on( "message", (message) => {

  const msg = message.content;
  
  if( /fresh goku/i.test( msg ) ) {
    const response = commands.freshGoku( msg );
    message.channel.send( response );
  }

  else if( /place \d \w/i.test( msg ) ) {
    const response = commands.place( msg );
    message.channel.send( response.board );
    if( !!response.winner ) {
      message.channel.send( "VERY CLEAN WIN: " + response.winner );
    }
  }

  else if( /HELP ME/.test( msg ) ) {
    message.channel.send(
      "```" +
      "Connect 4:\n" +
      "Command: fresh goku [int: rows] [int: cols]\n" +
      "Creates a new board; rows & columns default to 6 & 7 if not specified.\n" +
      "Command: place [int: col] [string: marker]\n" +
      "Places your mark on the given column.\n" +
      "```"
    );
  } 
  
});

bot.login( auth.token );
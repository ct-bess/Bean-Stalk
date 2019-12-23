import Discord from "discord.js";
import auth from "../auth.json";
import botHelp from "../botHelp.json";
import * as commands from "./commands/commands.js";

const bot = new Discord.Client({});

bot.on( "ready", () => {
  console.log( `Bean-Stalk is in: ${bot.user.tag}` );
});

bot.on( "message", (message) => {

  // BIG TODO:
  // [ ] only 1 game can be active at a time
  // [x] add a bean stalk command prefix like "bs" or "--"

  let msg = message.content;

  if ( !/^(bs|-)/i.test( msg ) ) return;

  else msg = msg.replace( /^(bs|-)\s?/, "" );
  
  if( /fresh goku/i.test( msg ) ) {
    const response = commands.freshGoku( msg );
    message.channel.send( response );
  }

  else if( /place \d \w/i.test( msg ) ) {
    const response = commands.place( msg );
    message.channel.send( response.board );
    if( !!response.winner ) {
      message.channel.send( "```fix\nA VERY CLEAN WIN BY: " + response.winner + "\n```" );
    }
  }

  // TODO: code split --> misc commands
  else if( /HELP ME/i.test( msg ) ) {

    const input = msg.split( /help\sme\s/i );
    let response = "```c\n";

    if( input.length > 1 ) {
      for( let prop in botHelp.commands[input[1]] ) {
        response += `${prop}: ${botHelp.commands[input[1]][prop]}\n`;
      }
    }
    else {
      for( let cmd in botHelp.commands ) {
        response += `${cmd}:\n`
        for( let prop in botHelp.commands[cmd] ) {
          response += `\t${prop}: ${botHelp.commands[cmd][prop]}\n`;
        }
      }
    }
    response += "\n```";
    message.channel.send( response );
  } 

  else if( /bean stalk\?/i.test( msg ) ) {
    let response = "```c\n";
    for( let prop in botHelp.BeanStalk ) {
      response += `${prop}: ${botHelp.BeanStalk[prop]}\n`;
    }
    response += "\n```";
    message.channel.send( response );
    message.channel.send( ":sweat_drops:" );
  }
  
});

bot.login( auth.token );
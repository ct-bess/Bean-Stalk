import Discord from "discord.js";
import auth from "../auth.json";
import botHelp from "../botHelp.json";
import connect4 from "./functions/connect4.js";
import dndUtilities from "./functions/dndUtilities.js";
import wumpusWorld from "./functions/wumpusWorld.js";

const bot = new Discord.Client({});

// Dont do this
const c4 = new connect4();
const dnd = new dndUtilities();
const wumpus = new wumpusWorld();

bot.on( "ready", () => {
  console.log( `Bean-Stalk is in: ${bot.user.tag}` );
});

bot.on( "message", ( message ) => {

  // BIG TODO:
  // [ ] only 1 game can be active at a time
  // [ ] option to print out the board 1 \n at a time for uge emoji action
  // [ ] actually make a logout command so we stop ^c'ing
  // [x] actually clean up connect 4
  // [ ] actually implement wumpus for once in your life

  let msg = {
    content: message.content,
    user: message.author
  };

  if ( !/^(bs|-)/i.test( msg.content ) ) return;

  else msg.content = msg.content.replace( /^(bs|-)\s?/, "" );
  
  if( /fresh goku/i.test( msg.content ) ) {
    const response = c4.exec( "buildBoard", msg );
    message.channel.send( response );
  }

  else if( /p(lace)? \d/i.test( msg.content ) ) {
    const response = c4.exec( "placeMarker", msg );
    message.channel.send( response.board );
    if( !!response.winner ) {
      message.channel.send( `A VERY CLEAN WIN BY: ${response.winner} :sweat_drops:` );
    }
  }

  else if( /^d\d+(\s\d+)?/i.test( msg.content ) ) {
    const response = dnd.exec( "roll", msg );
    message.channel.send( response );
  }

  else if( /hist(ory)?/i.test( msg.content ) ) {
    const response = dnd.exec( "rollHistory", msg );
    message.channel.send( response );
  }

  else if( /wumpus/i.test( msg.content ) ) {
    const response = wumpus.exec( "start", msg );
    message.channel.send( response );
  }

  else if( /w[udlr]/i.test( msg.content ) ) {
    const response = wumpus.exec( "move", msg );
    message.channel.send( response );
  }

  // TODO: code split --> misc commands
  else if( /HELP ME/i.test( msg.content ) ) {

    const input = msg.content.split( /help\sme\s/i );
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

  else if( /^bean stalk\??/i.test( msg ) ) {
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

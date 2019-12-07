import Discord from "discord.js";
import auth from "../auth.json";
import { c4start, c4place } from "./commands/connect4.js";

// -- Bot init
const bot = new Discord.Client({});
let c4board = null;

bot.on( "ready", () => {
  console.log( `BeanStalk connected as: ${bot.user.tag}` );
});

bot.on( "message", (message) => {

  const msg = message.content;
  
  if( msg === "fresh goku" ) {
    const board = c4start();
    c4board = board;
    message.channel.send( !!board ? board : "BIG ERROR LMAO" );
  }
  else if( /place \d \w/i.test( msg ) ) {
    const input = message.content.split( /\s/ );
    const nextBoard = c4place( input[1], input[2], c4board );
    c4board = !!nextBoard ? nextBoard : c4board;
    message.channel.send( !!nextBoard ? nextBoard : "VERY GOOD ERROR" );
  }
  
});

bot.login( auth.token );
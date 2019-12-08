import Discord from "discord.js";
import auth from "../auth.json";
import connect4 from "./commands/connect4.js";

// -- Bot init
const bot = new Discord.Client({});
const c4 = new connect4();

bot.on( "ready", () => {
  console.log( `Bean-Stalk is in: ${bot.user.tag}` );
});

bot.on( "message", (message) => {

  const msg = message.content;
  
  if( /fresh goku/i.test( msg ) ) {
    const input = message.content.split( /(\d+)/ );
    const rows = input[1], cols = input[3];
    console.log( "Fresh Goku: ", input );
    if( input.length >= 3 )
      c4.setBoard( rows, cols );
    else
      c4.setBoard( 6, 7 );
    c4.buildBoard();
    message.channel.send( !!c4.board ? c4.board : "BIG ERROR LMAO" );
  }

  else if( /place \d \w/i.test( msg ) ) {
    const input = message.content.split( /(?:place\s)?(\S+)/ );
    const col = input[1], marker = input[3];
    console.log( "Place:", input );
    c4.placeMarker( col, marker );
    message.channel.send( !!c4.board ? c4.board : "VERY GOOD ERROR" );
    if( c4.winCheck( marker ) )
      message.channel.send( `VERY COOL WIN: ${marker}` );
  }
  
});

bot.login( auth.token );
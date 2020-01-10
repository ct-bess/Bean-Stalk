import * as commands from "./commands/commands.js";
//import botHelp from "../botHelp.json";
import { default as botHelp } from "../botHelp.json";
import wumpusWorld from "./functions/wumpusWorld.js";

console.log( "THIS IS A NO DESCRIBE ZONE" );

function freshGokuTest( input ) {
  const response = commands.freshGoku( input );
  return( response );
}

function placeTest( input ) {
  const response = commands.place( input );
  return( response );
}

try {

  //console.log( botHelp.commands );
  //console.log( "HELP connect4".split( /HELP\s/ ) );

  // while tests do:
  // - board state is in commands

  //const ww = new wumpusWorld();
  //console.log( ww.start() );

  let input = null;
  let response = null;

  /*
  input = "bs place 2 X";
  console.log( input );
  input = input.replace( /^(bs|-)/, "" );
  console.log( input );
  */

  {
    input = "fresh goku";
    response = freshGokuTest( input );
    console.log( `RESPONSE:\n${response}` );
  }

  {
    input = "p 1";
    response = placeTest( input );
    console.log( `RESPONSE:\n${response.board}\n${response.winner}` );
  }

} catch( error ) {
  console.log( "LMAO!" );
  console.error( error );
}

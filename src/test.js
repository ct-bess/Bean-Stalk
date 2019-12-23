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

  const ww = new wumpusWorld();
  console.log( ww.start() );

  let input = null;
  let response = null;

  input = "bs place 2 X";
  console.log( input );
  input = input.replace( /^(bs|-)/, "" );
  console.log( input );

  {
    input = "fresh goku";
    let defaultBoard = "```\n0 1 2 3 4 5 6\n- - - - - - -\n0 0 0 0 0 0 0\n0 0 0 0 0 0 0\n0 0 0 0 0 0 0\n0 0 0 0 0 0 0\n0 0 0 0 0 0 0\n0 0 0 0 0 0 0\n```";
    response = freshGokuTest( input );
    if( response !== defaultBoard ) {
      console.log( `TEST DATA:\n${defaultBoard}` );
      console.log( `RESPONSE DATA:\n${response}` );
      throw new Error( "Board did not match" );
    }
  }

  {
    input = "place 1 X";
    let expectedBoard = "```\n0 1 2 3 4 5 6\n- - - - - - -\n0 X 0 0 0 0 0\n0 0 0 0 0 0 0\n0 0 0 0 0 0 0\n0 0 0 0 0 0 0\n0 0 0 0 0 0 0\n0 0 0 0 0 0 0\n```";
    response = placeTest( input );
    if( response !== expectedBoard ) {
      console.log( `TEST DATA:\n${expectedBoard}` );
      console.log( `RESPONSE DATA:\n${response}` );
      throw new Error( "Board did not match" );
    }
  }

} catch( error ) {
  console.log( "LMAO!" );
  console.error( error );
}

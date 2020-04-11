//import * as commands from "./commands/commands.js";
//import botHelp from "../botHelp.json";
import { default as botHelp } from "../botHelp.json";
import dndUtilities from "./functions/dndUtilities.js";
import wumpusWorld from "./functions/wumpusWorld.js";

const dnd = new dndUtilities();
const wump = new wumpusWorld();

console.log( "THIS IS A NO DESCRIBE ZONE" );

function freshGokuTest( input ) {
  const response = "";
  return( response );
}

function placeTest( input ) {
  const response = "";
  return( response );
}

try {

  let input = null;
  let response = null;

  wump.start();
  console.log( board );

  wump.board = board;
  wump.move( "down" );
  wump.move( "up" );
  wump.move( "right" );
  wump.move( "left" );

  /*
  input = {
    content: "d20",
    user: "test"
  }
  response = dnd.exec( "roll", input );
  console.log( "test case 1:\n", response );

  input = {
    content: "d4 2",
    user: "test"
  }
  response = dnd.exec( "roll", input );
  console.log( "test case 2:\n", response );

  input = {
    content: "d99 3",
    user: "test"
  }
  response = dnd.exec( "roll", input );
  console.log( "test case 3:\n", response );

  input = {
    content: "d420 x",
    user: "test"
  }
  response = dnd.exec( "roll", input );
  console.log( "test case 4:\n", response );

  input = {
    content: "rollHistory",
    user: "test"
  }
  response = dnd.exec( "rollHistory", input );
  console.log( "test case 5:\n", response );

  input = "bs place 2 X";
  console.log( input );
  input = input.replace( /^(bs|-)/, "" );
  console.log( input );

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
  */

} catch( error ) {
  console.log( "LMAO!" );
  console.error( error );
}

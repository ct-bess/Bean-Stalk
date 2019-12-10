import * as commands from "./commands/commands.js";
import expect from "expect";

console.log( "THIS IS A NO DESCRIBE ZONE" );

function freshGokuTest( input ) {
  const response = commands.freshGoku( input );
  console.log( response );
  expect( response ).toBeTruthy();
}

function placeTest( input ) {
  const response = commands.place( input );
  console.log( response );
}

try {

  // while tests do:
  let input = null;

  input = "fresh goku";
  freshGokuTest( input );

  input = "place 1 X";
  placeTest( input );

  placeTest( input );
  placeTest( input );
  placeTest( input );

} catch( error ) {
  console.error( error );
}

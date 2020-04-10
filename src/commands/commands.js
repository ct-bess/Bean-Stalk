// depreciated file, moved into connect4.js

import connect4 from "../functions/connect4.js";

const c4 = new connect4();

function freshGoku( message ) {

  let response = null
  if( !message ) return( "```diff\nVERY NULL fresh goku INPUT\n```" );

  // -- No custom boards, just custom emoji
  const input = message; //.split( /(\d+)/ );
  console.log( freshGoku, input );

  c4.buildBoard();
  response = !!c4.board ? c4.board : "```diff\nABSOLUTE freshGoku ERROR\n```";
  return( response );

}

function place( message ) {

  let response = null;
  if( !message ) return( "```diff\nVERY NULL place INPUT\n```" );
  //const input = message.split( /(?:place\s)?(\S+)/ );
  const input = message.split( /\s/ );
  console.log( place, input );

  if( !input )
    return( "```diff\nA VERY INVALID place INPUT marker\n```" );

  // -- TODO un *marker* the below

  const col = input[1], marker = "delet this";
  c4.placeMarker( col, marker );

  response = {
    winner:  c4.winCheck( marker ) ? marker : null,
    board: !!c4.board ? c4.board : "```diff\nVERY COOL place ERROR\n```"
  };
  return( response );
}

export { freshGoku, place };

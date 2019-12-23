import connect4 from "../functions/connect4.js";

// -- TODO: connect 4 game modes: FFA, 1v1
// -- TODO: make this file specifically for connect 4, or move to connect 4 class

const c4 = new connect4();

function freshGoku( message ) {
  let response = null
  if( !message ) return( "```diff\nVERY NULL fresh goku INPUT\n```" );
  const input = message.split( /(\d+)/ );
  console.log( freshGoku, input );

  // -- FIX THIS:
  //    Custom board sizes don't work

  const rows = input[1], cols = input[3];
  if( input.length >= 3 )
    c4.setBoard( rows, cols );
  else
    c4.setBoard( 6, 7 );
  c4.buildBoard();
  response = !!c4.board ? c4.board : "```diff\nABSOLUTE freshGoku ERROR\n```";
  return( response );
}

function place( message ) {
  let response = null;
  if( !message ) return( "```diff\nVERY NULL place INPUT\n```" );
  // -- FIX THIS: 
  //    You can't use a regex reserved char as part of your marker
  const input = message.split( /(?:place\s)?(\S+)/ );
  console.log( place, input );

  if( !input )
    return( "```diff\nA VERY INVALID place INPUT marker\n```" );

  const col = input[1], marker = input[3];
  c4.placeMarker( col, marker );

  response = {
    winner:  c4.winCheck( marker ) ? marker : null,
    board: !!c4.board ? c4.board : "```diff\nVERY COOL place ERROR\n```"
  };
  return( response );
}

export { freshGoku, place };

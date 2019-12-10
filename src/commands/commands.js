import connect4 from "../functions/connect4.js";

const c4 = new connect4();

function freshGoku( message ) {
  let response = null
  if( !message ) return( "VERY NULL fresh goku INPUT" );
  const input = message.split( /(\d+)/ );
  console.log( freshGoku, input );

  const rows = input[1], cols = input[3];
  if( input.length >= 3 )
    c4.setBoard( rows, cols );
  else
    c4.setBoard( 6, 7 );
  c4.buildBoard();
  response = !!c4.board ? c4.board : "ABSOLUTE freshGoku ERROR";
  return( response );
}

function place( message ) {
  let response = null;
  if( !message ) return( "VERY NULL place INPUT" );
  const input = message.split( /(?:place\s)?(\S+)/ );
  console.log( place, input );

  const col = input[1], marker = input[3];
  c4.placeMarker( col, marker );

  response = {
    winner:  c4.winCheck( marker ) ? marker : null,
    board: !!c4.board ? c4.board : "VERY COOL place ERROR"
  };
  return( response );
}

export { freshGoku, place };
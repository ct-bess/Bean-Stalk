import connect4 from "./commands/connect4.js";

console.log( "Use describe you stupid beast" );

{
  let initInput = "fresh goku";
  console.log( initInput.split( /(\d+)/ ) );
  initInput = "fresh goku 8 9";
  console.log( initInput.split( /(\d+)/ ) );
}
{
  let placeInput = "place 1 X";
  console.log( placeInput.split( /(?:place\s)?(\S+)/ ) );
  placeInput = "place 2 YEET";
  console.log( placeInput.split( /(?:place\s)?(\S+)/ ) );
}

/*
let c4 = new connect4();
c4.buildBoard();
console.log( c4.board );

const marker = "X";
c4.placeMarker( 0, marker );
c4.placeMarker( 0, marker );
c4.placeMarker( 0, marker );
c4.placeMarker( 0, marker );

console.log( c4.board );

if( c4.winCheck( marker ) )
  console.log( `Winner: ${marker}` );
else
  console.log( "lmao" );
*/
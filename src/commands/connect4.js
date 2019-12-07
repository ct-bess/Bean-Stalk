function c4start( /* cols, rows */ ) {

  const cols = 7, rows = 6;
  let board = [];

  for( let i = 0; i < cols; ++i ) {
    board.push( 0x30 + i );
    board.push( 0x20 );
  }
  board.push( 0xA );

  for( let i = 0; i < cols; ++i ) {
    board.push( 0x2D );
    board.push( 0x20 );
  }
  board.push( 0xA );

  for( let i = 0; i < rows; ++i ) {
    for( let j = 0; j < cols; ++j ) {
      board.push( 0x30 );
      board.push( 0x20 );
    }
    board.push( 0xA );
  }

  return( String.fromCharCode( ...board ) );

} // eo c4start

function c4place( col, marker, board ) {

  //const regex = new RegExp( `(?<=((\\S\\s)+\\n){${row}}(\\S\\s){${col}})(\\S)` );

  // -- Fuck it, we're playing inverted connect 4
  const regex = new RegExp( `(?<=(.+\\n)+(\\w+\\s){${col}})(0)` );
  const nextBoard = board.replace( regex, marker );
  return( nextBoard );

} // eo c4place

export { c4start, c4place };
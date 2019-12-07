function c4start( /* cols, rows */ ) {

  const cols = 7, rows = 6;
  let board = [];

  for( let i = 0; i < rows; ++i ) {
    for( let j = 0; j < cols; ++j ) {
      board.push( 0x30 );
      board.push( 0x20 );
    }
    board.push( 0xA );
  }

  return( String.fromCharCode( ...board ) );

} // eo c4start

function c4place( row, col, board, marker ) {

  // TODO: you can litterally plop a marker anywhere

  const regex = new RegExp( `(?<=((\\S\\s)+\\n){${row}}(\\S\\s){${col}})(0)` );
  const nextBoard = board.replace( regex, marker );
  return( nextBoard );

} // eo c4place

export { c4start, c4place };
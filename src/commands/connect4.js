class connect4 {

  constructor( rows, cols, board ) {
    this.rows = rows;
    this.cols = cols;
    this.board = board;
  }

  setBoard( rows, cols ) {
    this.rows = rows;
    this.cols = cols;
  }

  buildBoard() {

    //const cols = !!this.cols ? this.cols : 7;
    //const rows = !!this.rows ? this.rows : 6;
    let board = [];

    for( let i = 0; i < this.cols; ++i ) {
      board.push( 0x30 + i );
      board.push( 0x20 );
    }
    board.push( 0xA );

    for( let i = 0; i < this.cols; ++i ) {
      board.push( 0x2D );
      board.push( 0x20 );
    }
    board.push( 0xA );

    for( let i = 0; i < this.rows; ++i ) {
      for( let j = 0; j < this.cols; ++j ) {
        board.push( 0x30 );
        board.push( 0x20 );
      }
      board.push( 0xA );
    }

    this.board = String.fromCharCode( ...board );

  } // eo buildBoard

  placeMarker( col, marker ) {

    // -- Fuck it, we're playing inverted connect 4
    const regex = new RegExp( `(?<=(.+\\n)+(\\w+\\s){${col}})(0)` );
    this.board = this.board.replace( regex, marker );

  } // eo placeMarker

  winCheck( marker ) {

    // -- Vertical
    const regex = new RegExp( `(.*(${marker}\\s)((\\w+\\s)+\\n|\\n)){4}` );
    if( regex.test( this.board ) ) return( true );

    // -- Horizontal
    // -- Diagonal \
    // -- Diagonal /

    return( false );

  } // eo winCheck

}

export default connect4;
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

    if( !!this.rows ) this.rows = 6;
    if( !!this.cols ) this.cols = 7;

    let board = [ 0x60, 0x60, 0x60, 0xA ];

    /* -- This is bad, a 0 is interperated as an empty space my man
    for( let i = 0; i < this.cols; ++i ) {
      board.push( 0x30 + i );
      board.push( 0x20 );
    }
    board.push( 0xA );
    */

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

    board.push( 0x60 );
    board.push( 0x60 );
    board.push( 0x60 );

    this.board = String.fromCharCode( ...board );

  } // eo buildBoard

  placeMarker( col, marker ) {

    // -- Fuck it, we're playing inverted connect 4
    //    (this can be fixed with the sticky RegEx flag --> y)
    const regex = new RegExp( `(?<=(.+\\n)+(\\w+\\s){${col}})(0)` );
    this.board = this.board.replace( regex, marker );

  } // eo placeMarker

  winCheck( marker ) {

    // -- Vertical
    const vertRegex = new RegExp( `(.*(${marker}\\s)((\\w+\\s)+\\n|\\n)){4}` );
    if( vertRegex.test( this.board ) ) return( true );

    // -- Horizontal
    const horizRegex = new RegExp( `(${marker}\s){4}` );
    if( horizRegex.test( this.board ) ) return( true );

    // -- Make this not Unga-Bunga

    // -- FIX THIS
    //    Other markers are completing diagonals that they shouldn't and triggering wins

    // -- forward diagonal
    let diagLUTRegex = `(${marker}.+\\n)(.{2}${marker}.+\\n)(.{4}${marker}.+\\n)(.{6}${marker})|`;
    diagLUTRegex += `(.{2}${marker}.+\\n)(.{4}${marker}.+\\n)(.{6}${marker}.+\\n)(.{8}${marker})|`;
    diagLUTRegex += `(.{4}${marker}.+\\n)(.{6}${marker}.+\\n)(.{8}${marker}.+\\n)(.{10}${marker})|`;
    diagLUTRegex += `(.{6}${marker}.+\\n)(.{8}${marker}.+\\n)(.{10}${marker}.+\\n)(.{12}${marker})|`;
    // -- backward diagional
    diagLUTRegex += `(.{12}${marker}.+\\n)(.{10}${marker}.+\\n)(.{8}${marker}.+\\n)(.{6}${marker})|`;
    diagLUTRegex += `(.{10}${marker}.+\\n)(.{8}${marker}.+\\n)(.{6}${marker}.+\\n)(.{4}${marker})|`;
    diagLUTRegex += `(.{8}${marker}.+\\n)(.{6}${marker}.+\\n)(.{4}${marker}.+\\n)(.{2}${marker})|`;
    diagLUTRegex += `(.{6}${marker}.+\\n)(.{4}${marker}.+\\n)(.{2}${marker}.+\\n)(.{0}${marker})`;

    const diagonalRegex = new RegExp( diagLUTRegex, "g" );

    if( diagonalRegex.test( this.board ) ) return( true );

    return( false );

  } // eo winCheck

}

export default connect4;
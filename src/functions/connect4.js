class connect4 {

  constructor( board ) {
    this.board = board;
    this.blankSpace = ":white_circle:";
    this.players = { 
      p1: [ ":red_circle:", "WHO?" ],
      p2: [ ":blue_circle:", "WHO?" ],
      turn: 1,
    };
    this.emoji = [
      ":red_circle:",
      ":blue_circle:",
      ":green_circle:",
      ":orange_circle:",
      /* -- Custom emoji dont work the same way
      ":brad:",
      ":Ricardo:",
      ":maxonL:",
      ":mark:",
      ":vanFace:",
      ":sgtBilly:",
      */
    ];
  }

  buildBoard() {

    let board = ":one: :two: :three: :four: :five: :six: :seven: \n";

    for( let i = 0; i < 7; ++i ) board += ":small_red_triangle_down: ";
    board += "\n";

    for( let j = 0; j < 6; ++j ) {
      for( let i = 0; i < 7; ++i ) board += ":white_circle: ";
      board += "\n";
    }

    board += "\n";

    this.board = board;
    this.players.turn = 1;

    // -- PLACEHOLDER for random marker picker
    const randP1 = Math.floor( Math.random() * ( this.emoji.length - 0 ) ) + 0;
    const randP2 = Math.floor( Math.random() * ( this.emoji.length - 0 ) ) + 0;
    this.players.p1[0] = this.emoji[randP1];
    this.players.p2[0] = this.emoji[randP2];

  } // eo buildBoard

  placeMarker( col, marker ) {

    if( this.players.turn === 1 ) {
      marker = this.players.p1[0];
      this.players.turn = 2;
    }
    else {
      marker = this.players.p2[0];
      this.players.turn = 1;
    }

    console.log( "Marker --> " + marker );
    console.log( "Space --> " + this.blankSpace );

    // -- Fuck it, we're playing inverted connect 4
    //    (this can be fixed with the sticky RegEx flag --> y)
    const regex = new RegExp( `(?<=(.+\\n)+(:\\w+:\\s){${col}})(${this.blankSpace})` );
    this.board = this.board.replace( regex, marker );

  } // eo placeMarker

  winCheck( marker ) {

    marker = this.players.turn === 1 ? this.players.p1[0] : this.players.p2[0];

    // -- Vertical
    const vertRegex = new RegExp( `(.*(${marker}\\s)((:\\w+:\\s)+\\n|\\n)){4}` );
    if( vertRegex.test( this.board ) ) return( true );

    // -- Horizontal
    const horizRegex = new RegExp( `(${marker}\s){4}` );
    if( horizRegex.test( this.board ) ) return( true );

    // -- Make this not Unga-Bunga

    // -- FIX THIS
    //    Other markers are completing diagonals that they shouldn't and triggering wins

    /*
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
    */

    return( false );

  } // eo winCheck

}

export default connect4;
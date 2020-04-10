class connect4 {

  constructor( board ) {
    this.board = board;
    this.blankSpace = ":white_circle:";
    this.players = { // Could just make this an array of player objects 
      p1: { 
        marker: ":red_circle:", 
        playerID: "WHO?",
        hasTurn: true
      },
      p2: { 
        marker: ":blue_circle:", 
        playerID: "WHO?",
        hasTurn: false
      },
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

  exec( command, message ) {
    console.debug( `connect4 --> exec()` );

    let response = null;
    let input = null;

    if( !message ) return( "```diff\nVERY NULL connect4 MESSAGE\n```" );

    // Is this a good idea?
    switch( command ) {

      case "buildBoard":
        input = message; //.split( /(\d+)/ );
        this.buildBoard( message );
        response = !!this.board ? this.board : "```diff\nABSOLUTE freshGoku ERROR\n```";
      break;

      case "placeMarker":
        input = message.content.split( /\s/ );
        const col = input[1];
        const marker = this.players.p1.hasTurn ? this.players.p1.marker : this.players.p2.marker;
        this.placeMarker( col, marker );
        response = {
          winner:  this.winCheck( marker ) ? marker : null,
          board: !!this.board ? this.board : "```diff\nVERY COOL place ERROR\n```"
        };
      break;

      default:
        response = "```diff\nABSOLUTELY NO SUCH COMMAND\n```";

    }

    return( response );

  }

  buildBoard( message ) {

    let board = ":one: :two: :three: :four: :five: :six: :seven: \n";

    for( let i = 0; i < 7; ++i ) board += ":small_red_triangle_down: ";
    board += "\n";

    for( let j = 0; j < 6; ++j ) {
      for( let i = 0; i < 7; ++i ) board += ":white_circle: ";
      board += "\n";
    }

    board += "\n";

    this.board = board;

    this.players.p1.playerID = message.author;
    this.players.p2.playerID = message.author; // Good

    this.players.p1.hasTurn = true;
    this.players.p2.hasTurn = false;

    // -- PLACEHOLDER for random marker picker
    const randP1 = Math.floor( Math.random() * ( this.emoji.length - 0 ) ) + 0;
    const randP2 = Math.floor( Math.random() * ( this.emoji.length - 0 ) ) + 0;
    this.players.p1.marker = this.emoji[randP1];
    this.players.p2.marker = this.emoji[randP2];

  } // eo buildBoard

  placeMarker( col, marker ) {

    this.players.p1.hasTurn = !this.players.p1.hasTurn;
    this.players.p2.hasTurn = !this.players.p2.hasTurn;

    console.log( "Marker --> " + marker );
    console.log( "Space --> " + this.blankSpace );

    // -- Fuck it, we're playing inverted connect 4
    //    (this can be fixed with the sticky RegEx flag --> y)
    const regex = new RegExp( `(?<=(.+\\n)+(:\\w+:\\s){${col}})(${this.blankSpace})` );
    this.board = this.board.replace( regex, marker );

  } // eo placeMarker

  winCheck( marker ) {

    // -- Vertical
    const vertRegex = new RegExp( `(.*(${marker}\\s)((:\\w+:\\s)+\\n|\\n)){4}` );
    if( vertRegex.test( this.board ) ) return( true );

    // -- Horizontal
    const horizRegex = new RegExp( `(${marker}\s){4}` );
    if( horizRegex.test( this.board ) ) return( true );

    // Diagonal win is tough with only regex

    return( false );

  } // eo winCheck

}

export default connect4;

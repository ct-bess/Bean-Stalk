class wumpusWorld {

  /* specs:
  Uses raw emoji for this game & make it customizable
  Upon moving into a space sends the board & if we get a breeze(s) and/or a stentch
  Makes a random board on start up
  */

  constructor( board ) {
    this.board = board;
    this.wumpus = ":brad:";
    this.player = ":kenny:";
    this.pos = { x: 0, y: 0 };
  }

  start() {

    // placeholder
    let board = [ 0x57, 0x58, 0x58, 0x58, 0x50, 0x46, 0x40, 0x40, 0x40, 0x40 ];

    // do something like this to randomize
    for( let i = 0; i < board.length; ++i ) {
      const sel = Math.floor( Math.random() * board.length );
      board[i] = board[i] ^ board[sel];
      board[sel] = board[i] ^ board[sel];
      board[i] = board[i] ^ board[sel];
    }
    return( String.fromCharCode( ...board ) );

  }

  move( dir ) {
    // You'll pm 1 depending on the dir, then check the contents of that space
    // empty --> move to it
    // wumpus or pit --> lose
    // flag --> win
    console.log( regex.test( this.board ) );
    let newPos = { x: this.pos.x, y: this.pos.y };
    switch( dir ) {
      case "up":
        newPos.y -= 1;
        break;
      case "down":
        newPos.y += 1;
        break;
      case "left":
        newPos.x -= 1;
        break;
      case "right":
        newPos.x += 1;
        break;
      default:
    }
    const regex = new RegExp( `(?<=(.+\\s){${newPos.y}}(.+\\s){${newPos.x}})(.+\\s)`, "y" );
    // Remove old pos
    //
    // Add new pos
    //this.board = this.board.replace( regex, this.player );
  }

}

export default wumpusWorld;
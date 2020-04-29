// Possible features:
// - Treasure chest
// - player bow & arrow
// - Dynamic board size
// - Fixing board scramble
const emojiSet = {
  wumpus: ":orangutan:",
  stench: ":biohazard:",
  hidden: ":grey_question:",
  explored: ":o:",
  empty: ":white_square_button:",
  pit: ":dash:",
  goal: ":exclamation:"
};

export default {
  name: "wumpus",
  description: "Play a hot game of Wumpus World",
  aliases: [ "ww" ],
  state: {
    boards: {
      active: "",
      secret: ""
    },
    player: {
      marker: "",
      pos: { x: 0, y: 0 }
    },
    gameOver: true
  },
  exec( message, args ) {

    let response = "";

    switch( args[0] ) {
      case "n":
      case "new":
        // (P)it = 0x50, (W)umpus = 0x57, (E)mpty = 0x45, (F)lag = 0x46
        // (J)oy = 0x4A, eol = 0xA, \s = 0x20
        let board = [ 
          0x4A, 0x20, 0x57, 0x20, 0x50, 0x20, 0x50, 0xA,
          0x46, 0x20, 0x45, 0x20, 0x45, 0x20, 0x45, 0xA,
          0x45, 0x20, 0x45, 0x20, 0x45, 0x20, 0x45, 0xA,
          0x45, 0x20, 0x45, 0x20, 0x45, 0x20, 0x45, 0xA
        ];

        // Scramble board
        for( let i = 0; i < board.length; ++i ) {
          // LENGTH IS +1 BRUH (still breaks sometimes tho)
          const sel = Math.floor( Math.random() * board.length );
          if( board[i] !== 0x20 && board[i] !== 0xA && board[sel] !== 0x20 && board[sel] !== 0xA ) {
            board[i] = board[i] ^ board[sel];
            board[sel] = board[i] ^ board[sel];
            board[i] = board[i] ^ board[sel];
          }
        }

        const playerPos = board.indexOf( 0x4A );
        console.debug( "Index of player:", playerPos );
        console.debug( "board length: ", board.length );

        this.state.player.pos.y = Math.floor( playerPos / 8 );
        this.state.player.pos.x = Math.floor( ( playerPos - ( 8 * Math.floor( playerPos / 8 ) ) ) / 2 );
        this.state.player.marker = args[1] || ":joy:";

        console.debug( `x: ${this.state.player.pos.x}, y: ${this.state.player.pos.y}` );

        let newBoard = String.fromCharCode( ...board );
        this.state.boards.secret = newBoard;

        newBoard = newBoard.replace( /J/, this.state.player.marker );
        newBoard = newBoard.replace( /[WPEF]/gm, emojiSet.hidden );
        this.state.boards.active = newBoard;
        this.state.gameOver = false;

        console.debug( "Boards:" );
        console.debug( this.state.boards.secret );
        console.debug( this.state.boards.active );

        let startConds = this.checkRoom();
        startConds = startConds.replace( /W/, emojiSet.stench );
        startConds = startConds.replace( /P/g, emojiSet.pit );
        startConds = startConds.replace( /E/g, "" );
        startConds = startConds.replace( /F/, emojiSet.goal );
        response = this.state.boards.active + "\n**WHAT DO WE SEE?** " + startConds;
      break;
      case "m":
      case "move":
        if( !!this.state.gameOver ) response = "Start a game first";
        else response = this.move( args[1] || "error" );
      break;
      default:
        response = `subcommand ${args[1]} doesn't exist`;
    }

    message.channel.send( response );

  },
  checkRoom() {

    let roomInfo = "";
    const x1Regex = new RegExp( `(?<=(.+\\n){${this.state.player.pos.y}}(\\w\\s){${this.state.player.pos.x + 1}})(\\w)` );
    const x2Regex = new RegExp( `(?<=(.+\\n){${this.state.player.pos.y}}(\\w\\s){${this.state.player.pos.x - 1}})(\\w)` );
    roomInfo += ( this.state.boards.secret.match( x1Regex ) || "" )[0] || "";
    roomInfo += ( this.state.boards.secret.match( x2Regex ) || "" )[0] || "";
    const y1Regex = new RegExp( `(?<=(.+\\n){${this.state.player.pos.y + 1}}(\\w\\s){${this.state.player.pos.x}})(\\w)` );
    const y2Regex = new RegExp( `(?<=(.+\\n){${this.state.player.pos.y - 1}}(\\w\\s){${this.state.player.pos.x}})(\\w)` );
    roomInfo += ( this.state.boards.secret.match( y1Regex ) || "" )[0] || "";
    roomInfo += ( this.state.boards.secret.match( y2Regex ) || "" )[0] || "";
    return( roomInfo );

  },
  move( dir ) {

    let newPos = { x: this.state.player.pos.x, y: this.state.player.pos.y };
    let response = "";

    switch( dir ) {
      case "up":
      case "u":
        newPos.y -= 1;
        break;
      case "down":
      case "d":
        newPos.y += 1;
        break;
      case "left":
      case "l":
        newPos.x -= 1;
        break;
      case "right":
      case "r":
        newPos.x += 1;
        break;
      default:
        response = `Invalid movement: ${dir}`;
    }
    const movementRegex = new RegExp( `(?<=(.+\\n){${newPos.y}}(\\w\\s){${newPos.x}})(\\w)` );
    const nextRoom = this.state.boards.secret.match( movementRegex );
    console.info( "nextRoom = ", nextRoom );
    let roomInfo = "";

    switch( nextRoom[0] ) {
      case "E":
      case "X":
        const oldPosRegex = new RegExp( `(?<=(.+\\n){${this.state.player.pos.y}}(\\w\\s){${this.state.player.pos.x}})(\\w)` );
        this.state.boards.secret = this.state.boards.secret.replace( oldPosRegex, "X" );
        this.state.boards.secret = this.state.boards.secret.replace( movementRegex, "J" );
        // OK... THIS IS EPIC
        let newBoard = this.state.boards.secret;
        newBoard = newBoard.replace( /J/, this.state.player.marker );
        newBoard = newBoard.replace( /X/gm, emojiSet.explored );
        newBoard = newBoard.replace( /[WPEF]/gm, emojiSet.hidden );
        this.state.boards.active = newBoard;
        this.state.player.pos = newPos;
        roomInfo = this.checkRoom();
        roomInfo = roomInfo.replace( /W/, emojiSet.stench );
        roomInfo = roomInfo.replace( /P/g, emojiSet.pit );
        roomInfo = roomInfo.replace( /F/, emojiSet.goal );
        roomInfo = roomInfo.replace( /[EX]/g, "" );
        response = this.state.boards.active + "\n**WHAT DO WE SEE?** " + roomInfo;
      break;
      case "F":
        response = `**SHUCKS** YOU SAFELY GUIDED ${this.state.player.marker} TO THE GOAL :sweat_drops:\n`;
        this.state.gameOver = true;
      break;
      case "W":
        response = `**ded** by ${emojiSet.wumpus}`;
        this.state.gameOver = true;
      break;
      case "P":
        response = `**ded** by ${emojiSet.pit} *DS1 falling scream*`;
        this.state.gameOver = true;
      break;
      default:
        response = `Invalid room: ${nextRoom[0]}\n**FIX YOUR SHIT CONNOR** :rage:`;
    }

    // reveal secret board
    if( !!this.state.gameOver ) {
      let finalBoard = this.state.boards.secret;
      finalBoard = finalBoard.replace( /J/, this.state.player.marker );
      finalBoard = finalBoard.replace( /X/gm, emojiSet.explored );
      finalBoard = finalBoard.replace( /W/, emojiSet.wumpus );
      finalBoard = finalBoard.replace( /P/gm, emojiSet.pit );
      finalBoard = finalBoard.replace( /E/gm, emojiSet.empty );
      finalBoard = finalBoard.replace( /F/gm, emojiSet.goal );
      response += `\n${finalBoard}`;
    }

    return( response );

  }
};

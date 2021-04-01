import { argHandler } from "../commandUtil.js";
// - Dynamic board size
// - Fixing board scramble
const emojiSet = {
  wumpus: ":orangutan:",
  deadWumpus: ":bone:",
  stench: ":biohazard:",
  hidden: ":grey_question:",
  explored: ":o:",
  empty: ":white_square_button:",
  pit: ":dash:",
  goal: ":exclamation:",
  thump: ":wood:",
  bow: ":bow_and_arrow:"
};

export default {
  name: "wumpus",
  description: "Play a hot game of Wumpus World. Guide your player to the treasure",
  aliases: [ "ww" ],
  state: {
    boards: {
      active: "",
      secret: ""
    },
    player: {
      marker: "",
      pos: { x: 0, y: 0 },
      hasArrow: true
    },
    gameOver: true
  },
  exec( message, bot ) {
    const args = argHandler( message );
    const subcommand = args.get( 0 );
    let response = "";

    switch( subcommand ) {
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
        this.state.player.marker = args.get( "marker" ) || args.get( 1 ) || ":joy:";
        this.state.player.hasArrow = true;

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
        bot.user.setActivity( "WUMPUS" );
      break;
      case "m":
      case "move":
        if( !!this.state.gameOver ) response = "Start a game first";
        else response = this.move( args.get( "dir" ) || args.get( 1 ) || "error", "player", bot );
      break;
      case "s":
      case "shoot":
        if( !!this.state.gameOver ) response = "Start a game first";
        else response = this.move( args.get( "dir" ) || args.get( 1 ) || "error", "arrow", bot );
        break;
      default:
        response = `subcommand ${subcommand} doesn't exist`;
    }

    message.channel.send( response );

  },
  checkRoom() {

    // there might be wrapping going on, I was able to detect a wumpus on the other side of the map
    // E E E F E <-- still detected W here too
    // W E E P J <-- detected W here
    // E E E E E
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
  move( dir, what, bot ) {

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
        return( response );
    }

    // new pos
    const movementRegex = new RegExp( `(?<=(.+\\n){${newPos.y}}(\\w\\s){${newPos.x}})(\\w)` );
    const nextRoom = this.state.boards.secret.match( movementRegex );
    console.info( "nextRoom = ", nextRoom );
    let roomInfo = "";

    switch( nextRoom[0] ) {
      case "A": // arrow
        this.state.player.hasArrow = true;
      case "D": // dead wumpus
      case "E": // empty
      case "X": // explored
        if( what === "player" ) {
          // Mark old pos as explored, move player to new pos
          const oldPosRegex = new RegExp( `(?<=(.+\\n){${this.state.player.pos.y}}(\\w\\s){${this.state.player.pos.x}})(\\w)` );
          this.state.boards.secret = this.state.boards.secret.replace( oldPosRegex, "X" );
          this.state.boards.secret = this.state.boards.secret.replace( movementRegex, "J" );
          this.state.player.pos = newPos;
        }
        else if( what === "arrow" ) {
          // arrow drops to the ground, we sense nothing
          this.state.boards.secret = this.state.boards.secret.replace( movementRegex, "A" );
          this.state.player.hasArrow = false;
        }
      break;
      case "F": // flag/goal
        if( what === "player" ) {
          response = `**SHUCKS** YOU SAFELY GUIDED ${this.state.player.marker} TO THE GOAL :sweat_drops:\n`;
          this.state.gameOver = true;
        }
        else if( what === "arrow" && this.state.player.hasArrow === true ) {
          // Arrow hits chest, we hear a *thump*, arrow is unclaimable since this is the goal
          roomInfo += emojiSet.thump; // the thump might be OP info
          this.state.player.hasArrow = false;
        }
      break;
      case "W": // wumpus
        if( what === "player" ) {
          response = `**ded** by ${emojiSet.wumpus}`;
          this.state.gameOver = true;
        }
        else if( what === "arrow" && this.state.player.hasArrow === true ) {
          // Kill wumpus, remove arrow, mark space as empty in secret board, no new info given besides no stentch anymore
          this.state.boards.secret = this.state.boards.secret.replace( "W", "D" );
          this.state.player.hasArrow = false;
        }
      break;
      case "P": // pit
        if( what === "player" ) {
          response = `**ded** by ${emojiSet.pit} *DS1 falling scream*`;
          // join audio channel and play DS1 falling screem
          this.state.gameOver = true;
        }
        else if( what === "arrow" && this.state.player.hasArrow === true ) {
          // arrow falls down pit and is no longer retreivable, no info given
          this.state.player.hasArrow = false;
        }
      break;
      default:
        response = `Invalid room: ${nextRoom[0]}, hey brO nice bug\n`;
    }

    if( !!this.state.gameOver ) {
      // reveal secret board
      let finalBoard = this.state.boards.secret;
      finalBoard = finalBoard.replace( /J/, this.state.player.marker );
      finalBoard = finalBoard.replace( /X/gm, emojiSet.explored );
      finalBoard = finalBoard.replace( /W/, emojiSet.wumpus );
      finalBoard = finalBoard.replace( /D/, emojiSet.deadWumpus );
      finalBoard = finalBoard.replace( /A/, emojiSet.bow );
      finalBoard = finalBoard.replace( /P/gm, emojiSet.pit );
      finalBoard = finalBoard.replace( /E/gm, emojiSet.empty );
      finalBoard = finalBoard.replace( /F/gm, emojiSet.goal );
      response += `\n${finalBoard}`;
      bot.user.setActivity( "" );
    }
    else {
      // update board
      // OK... THIS IS EPIC
      let newBoard = this.state.boards.secret;
      newBoard = newBoard.replace( /J/, this.state.player.marker );
      newBoard = newBoard.replace( /X/gm, emojiSet.explored );
      newBoard = newBoard.replace( /[WPEFAD]/gm, emojiSet.hidden );
      this.state.boards.active = newBoard;
      // get room info
      roomInfo += this.checkRoom();
      roomInfo = roomInfo.replace( /W/, emojiSet.stench );
      roomInfo = roomInfo.replace( /P/g, emojiSet.pit );
      //roomInfo = roomInfo.replace( /F/, emojiSet.goal );
      roomInfo = roomInfo.replace( /A/, emojiSet.bow ); // This peice of info might be OP
      roomInfo = roomInfo.replace( /J/, "if we see this text, there's a bug. We shouldn't be sensing the player; We are the player" );
      roomInfo = roomInfo.replace( /[EXDF]/g, "" );
      response += this.state.boards.active + "\n**WHAT DO WE SEE?** " + roomInfo;
      response += `\n**Quiver**: ${!!this.state.player.hasArrow ? "full" : "empty"}`;
    }

    return( response );

  }
};

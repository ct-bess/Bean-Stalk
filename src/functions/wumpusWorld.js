class wumpusWorld {

  // Keep 2 boards: 1 as the Active board that shows J's back, the other as the secret board with the P's and W and F

  constructor( board ) {
    this.board = {
      secret: board,
      active: ""
    };
    this.wumpus = ":orangutan:";
    this.player = ":joy:";
    this.hiddenTile = ":grey_question:";
    this.exploredTile = ":o:";
    this.pos = { x: 0, y: 0 };
  }

  exec( command, message ) {

    let response = "";
    let input = null;

    switch( command ) {
      case "settings":
        input = message.content.split( /\s/ );
        // more settings? --> for ...input
        // For now, just the player
        if( !!input[1] ) { 
          this.player = input[1];
          response += `Player set to: ${this.player}`;
        }
        else response += "```diff\nInvalid player identifier\n```"
      break;
      case "start":
        this.start();
        let startConds = this.checkRoom();
        startConds = startConds.replace( /W/, ":biohazard:" );
        startConds = startConds.replace( /P/g, ":dash:" );
        startConds = startConds.replace( /E/g, "" );
        startConds = startConds.replace( /F/, ":exclamation:" );
        response = this.board.active + "\n**WHAT DO WE SEE?** " + startConds;
      break;
      case "move":
        input = message.content.replace( /w/i, "" );
        response = this.move( input );
      break;
      default:
        response = "```diff\nBruH no command\n```";
    }

    return( response );

  }
  
  checkRoom() {

    let roomInfo = "";
    const x1Regex = new RegExp( `(?<=(.+\\n){${this.pos.y}}(\\w\\s){${this.pos.x + 1}})(\\w)` );
    const x2Regex = new RegExp( `(?<=(.+\\n){${this.pos.y}}(\\w\\s){${this.pos.x - 1}})(\\w)` );
    roomInfo += ( this.board.secret.match( x1Regex ) || "" )[0] || "";
    roomInfo += ( this.board.secret.match( x2Regex ) || "" )[0] || "";
    const y1Regex = new RegExp( `(?<=(.+\\n){${this.pos.y + 1}}(\\w\\s){${this.pos.x}})(\\w)` );
    const y2Regex = new RegExp( `(?<=(.+\\n){${this.pos.y - 1}}(\\w\\s){${this.pos.x}})(\\w)` );
    roomInfo += ( this.board.secret.match( y1Regex ) || "" )[0] || "";
    roomInfo += ( this.board.secret.match( y2Regex ) || "" )[0] || "";
    return( roomInfo );

  }

  start() {

    // (P)it = 0x50, (W)umpus = 0x57, (E)mpty = 0x45, (F)lag = 0x46
    // (J)oy = 0x4A, eol = 0xA, \s = 0x20

    // Make this dynamic based on NxN input
    let board = [ 
      0x4A, 0x20, 0x57, 0x20, 0x50, 0x20, 0x50, 0xA,
      0x46, 0x20, 0x45, 0x20, 0x45, 0x20, 0x45, 0xA,
      0x45, 0x20, 0x45, 0x20, 0x45, 0x20, 0x45, 0xA,
      0x45, 0x20, 0x45, 0x20, 0x45, 0x20, 0x45, 0xA
    ];

    // Scramble board
    for( let i = 0; i < board.length; ++i ) {

      // sometimes we are scrambling spaces next to spaces? or a char with an eol
      const sel = Math.floor( Math.random() * ( board.length + 1 ) );

      if( board[i] !== 0x20 && board[i] !== 0xA && board[sel] !== 0x20 && board[sel] !== 0xA ) {
        board[i] = board[i] ^ board[sel];
        board[sel] = board[i] ^ board[sel];
        board[i] = board[i] ^ board[sel];
      }
    }

    const playerPos = board.indexOf( 0x4A );
    console.log( "Index of player:", playerPos );
    console.log( "board length: ", board.length );

    this.pos.y = Math.floor( playerPos / 8 );
    this.pos.x = Math.floor( ( playerPos - ( 8 * Math.floor( playerPos / 8 ) ) ) / 2 );

    console.log( `x: ${this.pos.x}, y: ${this.pos.y}` );

    let newBoard = String.fromCharCode( ...board );
    this.board.secret = newBoard;

    newBoard = newBoard.replace( /J/, this.player );
    newBoard = newBoard.replace( /[WPEF]/gm, this.hiddenTile );
    this.board.active = newBoard;

    console.debug( "Boards:" );
    console.debug( this.board.secret );
    console.debug( this.board.active );

    return;

  }

  move( dir ) {
    console.debug( `entering: move(${dir})` );

    let newPos = { x: this.pos.x, y: this.pos.y };
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
        response = "```diff\nInvalid movement\n```";
    }
    // Remove old pos
    // Add new pos
    //this.board.secret = this.board.secret.replace( regex, this.player );
    const movementRegex = new RegExp( `(?<=(.+\\n){${newPos.y}}(\\w\\s){${newPos.x}})(\\w)` );
    const nextRoom = this.board.secret.match( movementRegex );
    console.log( "nextRoom = ", nextRoom );
    let roomInfo = "";

    switch( nextRoom[0] ) {
      case "E":
      case "X":
        const oldPosRegex = new RegExp( `(?<=(.+\\n){${this.pos.y}}(\\w\\s){${this.pos.x}})(\\w)` );
        this.board.secret = this.board.secret.replace( oldPosRegex, "X" );
        this.board.secret = this.board.secret.replace( movementRegex, "J" );
        // OK... THIS IS EPIC
        //const wowNewRegex = new RegExp( `(?<=(.+\\n){${newPos.y}}(:\\w:\\s){${newPos.x}})(:\\w:)` );
        //this.board.active = this.board.active.replace( oldPosRegex, this.exploredTile );
        //this.board.active = this.board.active.replace( wowNewRegex, this.player );
        let newBoard = this.board.secret;
        newBoard = newBoard.replace( /J/, this.player );
        newBoard = newBoard.replace( /X/gm, this.exploredTile );
        newBoard = newBoard.replace( /[WPEF]/gm, this.hiddenTile );
        this.board.active = newBoard;
        this.pos = newPos;
        roomInfo = this.checkRoom();
        roomInfo = roomInfo.replace( /W/, ":biohazard:" );
        roomInfo = roomInfo.replace( /P/g, ":dash:" );
        roomInfo = roomInfo.replace( /F/, ":exclamation:" );
        roomInfo = roomInfo.replace( /[EX]/g, "" );
        response = this.board.active + "\n**WHAT DO WE SEE?** " + roomInfo;
      break;
      case "F":
        response = "Victory :sweat_drops:";
      break;
      case "W":
        response = "ded :point_right: " + this.wumpus;
      break;
      case "P":
        response = "ded :point_right: " + " *dark souls falling screem*";
      break;
      default:
        response = "```diff\nInvalid room bruH\n```";
    }

    return( response );

  }

}

export default wumpusWorld;

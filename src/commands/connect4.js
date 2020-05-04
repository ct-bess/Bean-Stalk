import { Collection } from "discord.js";

export default {
  name: "connect4",
  description: "Play a hot game of connect 4 `-connect4 <new|join|place|reset> ?<new?|number number> ?<join?emoji> <place?number>`",
  aliases: [ "c4" ],
  state: {
    timer: null,
    players: new Collection(),
    board: null
  },
  defaultMarkers: [
    ":red_circle:",
    ":blue_circle:",
    ":green_circle:",
    ":orange_circle:"
  ],
  blankSpace: ":white_circle:",
  exec( message, args ) {
    switch( args[0] ) {
      case "j":
      case "join":
        if( /[\[\]\\\^\$\?\.\*\+\{\}\)\(]+/g.test( args[1] || "" ) ) {
          message.channel.send( "Don't use regex reserved characters" );
          break;
        }
        const playerData = {
          username: message.author.username,
          marker: args[1] || this.defaultMarkers[ Math.floor( Math.random() * this.defaultMarkers.length ) ],
          turnOrder: this.state.players.array().length + 1 || 1,
          hasTurn: this.state.players.array().length === 0 ? true : false
        };
        this.state.players.set( playerData.username, playerData );
        message.reply( `You are player **${playerData.turnOrder}**` );
      break;
      case "n":
      case "new":
        const boardWidth = parseInt( args[1] ) || 7;
        const boardHeight = parseInt( args[2] ) || 6;
        let board = "";
        if( boardWidth === 7 ) {
          board = ":one: :two: :three: :four: :five: :six: :seven: \n";
        }
        else {
          board += "`"
          for( let i = 1; i < boardWidth + 1; ++i ) board +=  " " + i.toString() + "  ";
          board += "`\n";
          message.reply( "GOOD" );
        }

        for( let i = 0; i < boardWidth; ++i ) board += ":small_red_triangle_down: ";
        board += "\n";

        for( let j = 0; j < boardHeight; ++j ) {
          for( let i = 0; i < boardWidth; ++i ) board += ":white_circle: ";
          board += "\n";
        }

        board += "\n";

        if( board.length > 2000 ) {
          message.channel.send( `Board's too thicc: **${board.length}** must be less than 2000` );
        }
        else {
          this.state.board = board;
          message.channel.send( this.state.board );
        }
      break;
      case "p":
      case "place":
        const player = this.state.players.get( message.author.username );
        if( !player ) {
          message.reply( "You're not in this game" );
        }
        else if( !player.hasTurn ) {
          message.reply( ":sweat_drops: AINT GOT NO TURN :sweat_drops:" );
        }
        else {
          // -- Fuck it, we're playing inverted connect 4
          //    (this can be fixed with the sticky RegEx flag --> y)
          const col = parseInt( args[1] ) - 1;
          const placeRegex = new RegExp( `(?<=(.+\\n)+(\\S+\\s){${col}})(${this.blankSpace})` );
          this.state.board = this.state.board.replace( placeRegex, player.marker );
          message.channel.send( this.state.board );

          // No diagonals, too spaghetti
          // Also sometimes this doesnt work??????
          const vertRegex = new RegExp( `(.*(${player.marker}\\s)((\\S+\\s)+\\n|\\n)){4}` );
          const horizRegex = new RegExp( `(${player.marker}\\s){4}` );
          if( horizRegex.test( this.state.board ) || vertRegex.test( this.state.board ) ) {
            message.reply( "A VERY CLEAN WIN :sweat_drops:" );
            message.channel.send( `**SHUCKS** this Connect4 game is over THNX ${player.marker}` );
          }
          else {
            const currTurn = player.turnOrder % this.state.players.size;
            const nextPlayer = this.state.players.find( p => p.turnOrder === currTurn + 1 ) || 1;
            player.hasTurn = false;
            nextPlayer.hasTurn = true;
            // We could @ here
            message.channel.send( `Next player: **${nextPlayer.username}**` );
          }
        }
      break;
      case "reset":
        this.state.players = new Collection();
        this.state.board = null;
        message.channel.send( "Players & board reset" );
      break;
      default:
        console.warn( `connect4 arg ${args[1]} not found` );
        message.channel.send( `connect4 arg ${args[1]} not found` );
    }
  }
};

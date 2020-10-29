import { Collection } from "discord.js";
import { sendBulk } from "../sendBulk.js";

export default {
  name: "connect4",
  description: "Play an inverted game of connect 4",
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
  exec( message, bot ) {
    const args = message.content.slice( 1 ).split( /\s+/ );
    args.shift();
    let response = "";
    const stalemateRe = new RegExp( this.blankSpace );
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
        if( playerData.marker === String.fromCodePoint(9898) ) message.channel.send( "***STEALTH 100***" );
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
          for( let i = 1; i < boardWidth + 1; ++i ) board += i.toString() + ", ";
          board += "\n";
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
          message.channel.send( `Board's too thicc: **${board.length}**, we're playin connect4 nothing` );
          //sendBulk( board, message, null );
        }
        else {
          message.channel.send( board );
        }

        this.state.board = board;
        bot.user.setActivity( "CONNECT 4" );
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
          if( placeRegex.test( this.state.board ) === false ) {
            message.channel.send( `Column **${col+1}** is full, try one with a free space :white_circle:` );
            break;
          }

          this.state.board = this.state.board.replace( placeRegex, player.marker );


          if( this.state.board.length > 2000 ) {
            //sendBulk( this.state.board, message, null );
            const partition = Math.floor( Math.random() * this.state.board.length );
            message.channel.send( this.state.board.substring( partition, partition + 2000 ) );
          }
          else {
            message.channel.send( this.state.board );
          }

          const hasWon = this.winCheck( player.marker, this.state.board );

          if( hasWon === true ) {
            message.reply( "A VERY CLEAN WIN :sweat_drops:" );
            message.channel.send( `**SHUCKS** this Connect4 game is over THNX ${player.marker}` );
          }
          else {
            const currTurn = player.turnOrder % this.state.players.size;
            const nextPlayer = this.state.players.find( p => p.turnOrder === currTurn + 1 ) || 1;
            player.hasTurn = false;
            nextPlayer.hasTurn = true;
            message.channel.send( `**YOUR MOVE BR0:** ${nextPlayer.marker} ${nextPlayer.username} ${nextPlayer.marker}` );
          }
        }

        if( stalemateRe.test( this.state.board ) === false ) {
          message.channel.send( "No more blank spaces available; Games over pardner, it's a draw :sweat_drops:" );
        }
      break;
      case "list":
        response = "Player list:\n";
        this.state.players.forEach( p => { 
          response += `player ${p.turnOrder}: **${p.username}** ${p.marker} ${p.hasTurn ? "**your turn**" : ""}\n`;
        });
        message.channel.send( response );
        break;
      case "kick":
        if( !this.state.players.has( args[1] ) ) {
          message.channel.send( `couldn't find ${args[1]}` );
        }
        else {
          let decomTurn = 0, decomPlayer = this.state.players.get( args[1] );
          if( decomPlayer.hasTurn ) decomTurn = decomPlayer.turnOrder;
          this.state.players.delete( args[1] );
          // TRUST ME
          this.state.players.forEach( p => { 
            if( decomTurn > 0 && p.turnOrder === decomTurn ) p.hasTurn = true;
            p.turnOrder = (((p.turnOrder===1)+0)*1)+(((p.turnOrder!==1)+0)*(p.turnOrder - 1)) 
          });
          if( this.state.players.size > 0 && !this.state.players.find( p => p.hasTurn === true ) ) this.state.players.last().hasTurn = true;
          response = `Kicked **${args[1]}**`;
          message.channel.send( response );
        }
        break;
      case "reset":
        this.state.players.deleteAll(); //= new Collection();
        this.state.board = null;
        message.channel.send( "Players & board reset" );
      break;
      default:
        console.warn( `connect4 arg ${args[1]} not found` );
        message.channel.send( `connect4 arg ${args[1]} not found` );
    }
    // message.channel.send( response );

  },
  // No RegEx sorry
  winCheck( playerMarker, board ) {
    const firstSplit = board.split('\n');
    firstSplit.shift();
    firstSplit.shift();
    //console.info( firstSplit );

    let playerMap = [];

    for( const i in firstSplit ) {
      const secondSplit = firstSplit[i].split(' '); 
      if( secondSplit[secondSplit.length-1] === '' ) secondSplit.pop();
      //console.info( secondSplit );
      let chunk = [];
      for( const j in secondSplit ) {
        if( secondSplit[j] === playerMarker ) chunk.push( parseInt( j ) + 1 );
        else chunk.push( 0 )
      }
      playerMap.push( chunk );
    }

    let win = false;

    rowLoop: for( let i = 0; i < playerMap.length; ++i ) {
      //console.info( "row:", i, typeof(i) );
      markerLoop: for( let j = 0; j < playerMap[i].length; ++j ) {
        const marker = playerMap[i][j];
        //console.info( "For marker:", marker, "at:", j );
        if( marker !== 0 ) {
          const vertCheck = (playerMap[i+1][j]>0)&&(playerMap[i+2][j]>0)&&(playerMap[i+3][j]>0);
          const horizCheck = (playerMap[i][j+1]>0)&&(playerMap[i][j+2]>0)&&(playerMap[i][j+3]>0);
          const fDiagCheck = (playerMap[i+1][j+1]>0)&&(playerMap[i+2][j+2]>0)&&(playerMap[i+3][j+3]>0);
          const bDiagCheck = (playerMap[i+1][j-1]>0)&&(playerMap[i+2][j-2]>0)&&(playerMap[i+3][j-3]>0);
          //console.info({ vert: vertCheck, horiz: horizCheck, fDiag: fDiagCheck, bDiag: bDiagCheck });
          if( vertCheck || horizCheck || fDiagCheck || bDiagCheck === true ) {
            win = true;
            break rowLoop;
          }
        }
      }
    }

    //console.info( "playerMap:", playerMap );
    //console.info( "win?:", win );
    return( win );
  }
};

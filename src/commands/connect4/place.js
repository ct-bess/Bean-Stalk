import InternalError from '../../struct/InternalError';
import Response from '../../struct/Response';
import Constants from '../../util/constants';
import { checkWin } from "./checkWin";

/**
 * incredible logic to place connect4 markers on the board
 * @param {ButtonInteraction} interaction
 * @this Connect4
 */
export const place = function( interaction ) {

  const response = new Response( Constants.interactionMethods.UPDATE, { components: this.state.actionRows } );
  const player = this.state.players.get( interaction.user.id );

  if( !player ) {
    interaction.reply({ content: "you're not in the game, join first", ephemeral: true });
    return;
  }
  else if( !player.hasTurn ) {
    interaction.reply({ content: "aint got not turn, WAIT", ephemeral: true });
    return;
  }

  let column = parseInt( interaction.component?.label );

  if( column !== 0 && !column ) {
    throw new InternalError( `connect4 column to place marker in is not a number: ${column}` );
  }

  column--;
  const blank = this.defaults.markers.blank;
  const delimiter = this.defaults.board.delimiter;
  const placeRegex = new RegExp( `(?<=(.+\\n)+(\\S+${delimiter}){${column}})(${blank})` );

  if( !placeRegex.test( this.state.board ) ) {
    interaction.reply( `Column ${column+1} is full, try one with a free space ${blank}` );
    return;
  }

  this.state.board = this.state.board.replace( placeRegex, player.marker );

  if( checkWin( player.marker, this.state.board, this.defaults.board.delimiter ) ) {
    response.payload.content = this.state.board + `\n${player.marker} **VERY CLEAN WIN KING** ${player.marker}`;
    response.payload.components = [];
    this.state.inProgress = false;
  }
  else {
    const currTurn = player.turnOrder % this.state.players.size;
    const nextPlayer = this.state.players.find( p => p.turnOrder === currTurn + 1 ) || 1;
    player.hasTurn = false;
    nextPlayer.hasTurn = true;
    const players = this.state.players.map( p => p.hasTurn ? `${p.marker}**${p.name}**` : p.marker + p.name );
    response.payload.content = this.state.board + "\n" + players.join( "," );
  }

  return( response );

}

/**
 * @typedef {import('./connect4').default} Connect4
 * @typedef {import('discord.js').ButtonInteraction} ButtonInteraction
 */
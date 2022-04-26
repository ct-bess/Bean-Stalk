import Command from "../../struct/Command";
import CommandOptions from "./options.json";
import Response from "../../struct/Response";
import Constants from "../../util/constants"
import { homeGuildId, testGuild } from "../../../secrets.json";
import { Collection, MessageActionRow, MessageButton } from "discord.js";
import { place } from "./place";

/**
 * the legendary 95% regular expression BASED connect 4 javascript command.
 * NOW FEATURING COMPONENTS :tm:, FROM THE DISCORD.JS :tm: LIBRARY!
 * - Note: if more than 1 player shares the same marker, then they're on the same team
 */
class Connect4 extends Command {

  state = {
    players: new Collection(),
    inProgress: false,
    board: "",
    actionRows: null
  }

  defaults = {
    markers: {
      players: [
        Constants.emoji.RED_CIRCLE,
        Constants.emoji.BLUE_CIRCLE,
        Constants.emoji.GREEN_CIRCLE,
        Constants.emoji.ORANGE_CIRCLE
      ],
      blank: Constants.emoji.WHITE_CIRCLE
    },
    board: {
      length: 6,
      width: 7,
      delimiter: "\t"
    }
  }

  constructor() {
    super( CommandOptions );
    this.guild = [ testGuild, homeGuildId ];
  }

  /**
   * buttons govern mark placement and stuff
   * @param {CommandInteraction} interaction
   * */
  connect4 = ( interaction ) => {

    let response = null;
    if( interaction.isButton() ) {

      if( /place/i.test( interaction.customId ) ) {

        response = place.call( this, interaction );

      }
      else {
        console.warn( "unknown connect4 interaction:", interaction.customId );
      }

    }

    return( response );
  }

  /** @param {CommandInteraction} interaction */
  new = ( interaction ) => {

    if( this.state.inProgress && !interaction.options.getBoolean( "override" ) ) {
      console.info( "cannot start a new connect4 game without overriding the current game" );
      return( new Response(
        Constants.interactionMethods.REPLY, { 
          content: `but are you sure?? ${Constants.emoji.FLUSHED}`,
          ephemeral: true
      }));
    }

    this.state.players = new Collection();
    const delimiter = this.defaults.board.delimiter;
    // hold your applause..
    this.state.board = Constants.emoji.ONE + delimiter + Constants.emoji.TWO + delimiter + Constants.emoji.THREE + delimiter + Constants.emoji.FOUR + delimiter + Constants.emoji.FIVE + delimiter + Constants.emoji.SIX + delimiter + Constants.emoji.SEVEN + delimiter + "\n";
    this.state.inProgress = true;
    const length = this.defaults.board.length;
    const width = this.defaults.board.width;
    const actionRows = [], components = [];

    for( let i = 1; i < width + 1; ++i ){

      components.push( new MessageButton({
        label: i + "",
        style: Constants.styles.PRIMARY,
        customId: `${this.name}-place-${i}`
      }));

      for( let i = 0; i < length + 1; ++i ) {
        this.state.board += `${this.defaults.markers.blank}${this.defaults.board.delimiter}`;
      }
      this.state.board += "\n";

    };

    while( components.length > Constants.limits.ACTION_ROW_COMPONENTS ) {
      const elements = components.splice( 0, Constants.limits.ACTION_ROW_COMPONENTS );
      actionRows.push( new MessageActionRow().addComponents( elements ) );
    }

    if( components.length > 0 ) {
      actionRows.push( new MessageActionRow().addComponents( components ) );
    }

    this.state.actionRows = actionRows;

    return( new Response( Constants.interactionMethods.REPLY, { content: this.state.board, components: actionRows } ) );

  }

  /** @param {CommandInteraction} interaction */
  join = ( interaction ) => {

    const response = new Response( Constants.interactionMethods.REPLY, { ephemeral: true } );

    if( !this.state.players.has( interaction.user.id ) ) {

      const marker = interaction.options.getString( "emoji" ) || this.defaults.markers.players[ Math.floor( Math.random() * this.defaults.markers.players.length ) ];

      if( /[\[\]\\\^\$\?\.\*\+\{\}\)\(]+/g.test( marker ) ) {
        response.payload.content = `Try again without regex reserved characters ${Constants.emoji.TRIUMPH}`;
        return( response );
      }

      const playerData = {
        name: interaction.user.username,
        hasTurn: this.state.players.size === 0,
        turnOrder: this.state.players.size + 1,
        marker
      };
      this.state.players.set( interaction.user.id, playerData );

      response.payload.content = `Your in king ${marker}, turn number *${playerData.turnOrder}*`;

      if( String.fromCodePoint( 9898 ) === marker ) {
        response.payload.content += "\n***STEALTH 100***"
      }

    }
    else {
      response.payload.content = `your already in,, ${Constants.emoji.FLUSHED}`;
    }

    return( response );

  }

  /**
   * - note: by kicking a player, the turn order display is now out of sync. do we want to fix??
   * - note: anyone can do this
   * @param {CommandInteraction} interaction
   * */
  kick = ( interaction ) => {
    const response = new Response( Constants.interactionMethods.REPLY );
    const playerToKick = interaction.options?.getUser( "who" );
    if( !playerToKick || !this.state.players.has( playerToKick ) ) {
      response.payload = {
        ephemeral: true,
        content: `got no *${playerToKick}* to kick`
      };
    }
    else {
      let decomTurn, decomPlayer = this.state.players.get( playerToKick );
      decomTurn = decomPlayer.hasTurn ? decomPlayer.turnOrder : 0;

      this.state.players.delete( playerToKick );

      // TRUST ME
      this.state.players.forEach( p => { 
        if( decomTurn > 0 && p.turnOrder === decomTurn ) {
          p.hasTurn = true;
        }
        p.turnOrder = (((p.turnOrder===1)+0)*1)+(((p.turnOrder!==1)+0)*(p.turnOrder - 1))
      });

      if( this.state.players.size > 0 && !this.state.players.find( p => p.hasTurn === true ) ){
        this.state.players.first().hasTurn = true;
      }

      response.payload.content = `Kicked **${playerToKick}** ${Constants.emoji.SOB}`;
      console.info( "kicked connect4 player:", playerToKick, "by:", interaction.user.id );

    }

    return( response );
  }

};

export default new Connect4();

/**
 * @typedef {import('../../struct/Bot').default} Bot
 * @typedef {import('discord.js').CommandInteraction} CommandInteraction
 * @typedef {import('discord.js').SelectMenuInteraction} SelectMenuInteraction
 * @typedef {import('discord.js').ButtonInteraction} ButtonInteraction
 */
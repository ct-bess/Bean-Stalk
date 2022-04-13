import { MessageActionRow, MessageSelectMenu } from "discord.js";
import InternalError from "./InternalError";

/**
 * Base Command class for commands to inherit.
 * the command data is from the slash command context
 * @property {string} name - The command's name
 * @property {string} description - A short description of the command
 * @property {string} type - command type
 * @property {object} options - command options
 * @property {function} - any method aside from the defaults are subcommands set by constructor
 */
class Command {

  /**
   * @param {CommandData} CommandData - list of options for command creation
   */
  constructor( CommandData ) {

    this.name = (CommandData.name + "").toLowerCase();
    this.description = CommandData.description;
    this.type = CommandData.type;
    this.options = CommandData.options;

    // Discord.js will also throw an error on slash command creation
    if( !this.name || this.name?.length === 0 ) {
      throw new Error( "Command name cannot be empty or null" );
    }

    for( const f in this ) {
      if( this[f] instanceof Function ) {
        this[f] = this[f].bind( this );
      }
    }

  }

  /**
   * Function that executes commands
   * @method exec
   * @memberof Command
   * @param {CommandInteraction} interaction - The Discord command interaction
   * @param {Bot} bot - the Discord Client executing the command
   * @returns {void}
   */
  exec = ( interaction ) => {

    // Default to base if no subcommand
    const command = interaction.options?.getSubcommand() || this.name;
    console.debug( "executing:", command );

    if( !command || !this[command] ) {
      console.warn( "no function to execute for:", command, interaction );
      return;
    }

    /** @type {Response|Promise<Response>} */
    const response = this[command].call( this, interaction );

    if( response instanceof Promise ) {
      response.then( res => { this.respond( interaction, res ) });
    }
    else {
      this.respond( interaction, response )
    }

  }

  /**
   * absolutely brilliant responding method
   * @param {CommandInteraction} interaction
   * @param {Response|{}} response
   */
  respond = ( interaction, response ) => {
    if( !response || !interaction[response.method] ) {
      throw new ReferenceError( `No such method/response: ${response?.method} ${interaction.prototype}` );
    }

    interaction[response.method]( response.payload )?.catch( error => {
      throw new InternalError( error.message );
    });
  }

  /**
   * Builds select menus awesome
   * select menus can have 1 to 25 options, no duplicate options, and only 1 select menu per action row
   * @param {MessageSelectMenuOptions} selectData
   * @returns {array<MessageActionRow>}
   */
  buildSelectMenu = ( selectData ) => {

    const actionRows = [];

    if( selectData.options.length <= 25 ) {
      actionRows.push( new MessageActionRow().addComponents(
        new MessageSelectMenu( selectData )
      ));
    }
    else {

      let i = 0;

      while( selectData.options.length > 25 ) {
        const elements = selectData.options.splice( 0, 25 );
        const data = Object.create( selectData );
        data.options = elements;
        data.customId = selectData.customId + i;
        actionRows.push( new MessageActionRow().addComponents(
          new MessageSelectMenu( data )
        ));
        ++i;
      }

      // finally, push remaining options
      if( selectData.options.length > 0 ) {
        selectData.customId = selectData.customId + i;
        actionRows.push( new MessageActionRow().addComponents(
          new MessageSelectMenu( selectData )
        ));
      }

    }

    if( actionRows.length > 5 ) {
      console.info( "action rows exceeds the max of 5; action row length:", actionRows.length );
    }

    return( actionRows );

  }

};

export default Command;

/**
 * @typedef {import('discord.js').Message} Message
 * @typedef {import('discord.js').Collection} Collection
 * @typedef {import('discord.js').CommandInteraction} CommandInteraction
 * @typedef {import('discord.js').MessageSelectMenuOptions} MessageSelectMenuOptions
 * @typedef {import('./Bot').default} Bot
 * @typedef {import('./Response').default} Response
 */

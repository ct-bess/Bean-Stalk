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

    for( const f in this ) {
      if( this[f] instanceof Function ) {
        this[f] = this[f].bind( this );
      }
    }

  }

  /**
   * Function that executes command interactions
   * @method exec
   * @memberof Command
   * @param {CommandInteraction} interaction - The Discord command interaction
   * @param {Bot} bot - the Discord Client executing the command
   * @returns {void}
   */
  exec = ( interaction ) => {

    // Default to base if no subcommand --> is a component or a command w/no subcommands
    const command = interaction.options?.getSubcommand() || this.name;
    console.debug( "executing command:", command );

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

    if( !response ) {
      return;
    }
    else if( !interaction[response.method] ) {
      throw new ReferenceError( `No such response: ${response?.method} ${interaction.prototype}` );
    }

    interaction[response.method]( response.payload )?.catch( error => {
      console.error( "interaction response failed for:", interaction, response );
      throw new InternalError( error );
    });

  }

};

export default Command;

/**
 * @typedef {import('discord.js').Message} Message
 * @typedef {import('discord.js').Collection} Collection
 * @typedef {import('discord.js').CommandInteraction} CommandInteraction
 * @typedef {import('discord.js').SelectMenuBuilderOptions} SelectMenuBuilderOptions
 * @typedef {import('./Bot').default} Bot
 * @typedef {import('./Response').default} Response
 */

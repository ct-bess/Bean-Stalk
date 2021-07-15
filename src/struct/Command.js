import { 
  argHandler, 
  sendBulk as _sendBulk,
  coalesce as _coalesce
 } from "../util/commandUtil";

/**
 * Base Command class for commands to inherit.
 * Subcommands *should* be defined as methods of inherited classes.
 * @property {string} name - The command's name
 * @property {string} description - A short description of the command
 * @property {Array<string>} aliases - alternative names for the command
 */
class Command {

  /**
   * all spaces in name and aliases are replaced with underscore, they're also lower cased
   * @param {string} [name=""] - The command's name that triggers it
   * @param {string} [description=""] - The command's description
   * @param {Array<string>} [aliases=[]] - alternative or shorthand command names that also trigger it
   */
  constructor( name = "", description = "", aliases = [] ) {
    this.name = name.replaceAll( " ", "_" ).toLowerCase();
    this.description = description;
    this.aliases = [];
    for( const alias of aliases ) {
      this.aliases.push( (alias + "").replaceAll( " ", "_" ).toLowerCase() );
    }
    console.trace( "Creating Command:", this );
  }

  /**
   * Function that executes on command.
   * Default behavior simply tries to execute a subcommand
   * @method exec
   * @memberof Command
   * @param {Message} message - The Discord Message that triggered the command
   * @param {Bot} bot - the Discord Client executing the command
   * @returns {void}
   */
  exec = ( message, bot ) => {

    const args = this.getArgs( message ); 
    const subcommand = args.get( 0 );
    const response = this[subcommand]?.( args, message, bot );

    if( !!response && response?.length > 0 ) {
      message.send( response );
    }

  }

  /**
   * wrapper to {@link commandUtil.argHandler}
   * @method getArgs
   * @memberof Command
   * @param {(Message|string)} message - Discord.Message or its' contents to get args from
   * @returns {Collection<commandArg,argVal>} arg map
   * @todo 
   * consider adding different ways to get args, ie. "complex" might be calling argHandler, "simple" could be only taking an expr and/or subcommand
   */
  getArgs = ( message ) => {
    const args = argHandler( message );
    return( args );
  }

  /**
   * wrapper to {@link commandUtil.sendBulk}
   * @method sendBulk
   * @memberof Command
   * @param {string} response the long string we want to send in bulk
   * @param {Message} message the message origin
   * @param {string} [format] optional, the markdown format to use: italics, bold, inline code, quote, quote block, code block
   * @param {string} [codeBlockType=""] optional, the language to format the code with
   * @returns {void}
   */
  sendBulk = ( response, message, format, codeBlockType ) => {
    _sendBulk( response, message, format, codeBlockType )
  }

  /**
   * wrapper to {@link commandUtil.coalesce}
   * @method coalesce
   * @memberof Command
   * @param {string} name - the user, channel, or role name or snowflake ID we are coalescing
   * @param {("channel"|"member"|"role")} type - what discord class type we are converting it
   * @param {Bot} [bot] - discord client processing this (not needed for member and role coalescing)
   * @param {Guild} [guild] - guild origin (not needed for channel coalescing)
   * @returns {?(Channel|Member|Role)} the Discord object with respect to the input type; If null the coalescing failed
   */
  coalesce = ( name, type, bot, guild ) => {
    const base = _coalesce( name, type, bot, guild );
    return( base );
  }

};

export default Command;

/**
 * @typedef {import('discord.js').Message} Message
 * @typedef {import('discord.js').Collection} Collection
 * @typedef {import('./Bot').default} Bot
 * @typedef {import('../util/commandUtil').commandArgs} commandArgs
 */

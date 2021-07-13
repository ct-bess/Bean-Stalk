import { 
  argHandler, 
  sendBulk as _sendBulk,
  coalesce as _coalesce
 } from "../util/commandUtil";

/**
 * @typedef {import('discord.js').Message} Message
 * @typedef {import('discord.js').Collection} Collection
 * @typedef {import('./Bot').default} Bot
 * @typedef {import('../util/commandUtil').commandArgs} commandArgs
 */

/**
 * Base Command class for commands to inherit
 * @property {string} name - The command's name that triggers it
 * @property {string} description - The command's description
 * @property {Array<string>} aliases - alternative or shorthand command names that also trigger it
 */
class Command {

  /**
   * all spaces in name and aliases are replaced with underscore
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
   * **This should absolutely be overridden.**
   * Default behavior is to print the entire command to the text channel
   * @param {Message} message - The Discord Message that triggered the command
   * @param {Bot} bot - the Discord Client executing the command
   * @returns {void}
   */
  exec = ( message, bot ) => {
    let response = "";
    for( const key in this ) {
      response += this[key] + "\n";
    }
    response = response.replaceAll( '`', '\\`' );
    if( response.length < 1990 ) message.send( "```js\n" + response + "\n```" );
    else this.sendBulk( response, message, "code block", "js" );
  }

  /**
   * wrapper to {@link argHandler}
   * @param {(Message|string)} message - Discord.Message or its' contents to get args from
   * @returns {Collection<commandArgs,(string|boolean)>} arg map
   */
  getArgs = ( message ) => {
    const args = argHandler( message );
    return( args );
  }

  /**
   * wrapper to {@link sendBulk}
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
   * wrapper to {@link coalesce}
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

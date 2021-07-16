/**
 * {@link Dice} subcommands
 * @module dice
 */

/**
 * @name choose
 */
export const choose = {

  help: "here be subcommand options/help?",

  /**
   * @method exec
   * @memberof module:dice.choose
   * @this Dice
   * @param {commandArg} args
   * @param {Message} message
   * @param {Bot} bot
   * @returns {string} the randomly selected option
   */
  exec: function( args, message, bot ) {
    let response = "";
    let options = args.get( "options" ) || args.get( 1 );

    if( /,/g.test( options ) ) {
      options = options.split( "," );
    }
    else options = options.split( " " );

    const selected = ( this.roll( options.length, 1, 1, message.author.username ) ).val - 1;
    this.history[ this.history.length - 1 ].value += ` (${options[selected]})`;
    const randEmoji = bot.emojis.cache.random();

    if( args.has( "quiet" ) ) {
      response = options[selected];
    }
    else response = `**${options[selected]}** <:${randEmoji.name}:${randEmoji.id}> <@!${message.author.id}>`;

    return( response );

  } 

};

/**
 * @name hist
 */
export const hist = {

  help: "here be subcommand options/help?",

  /**
   * @method exec
   * @memberof module:dice.hist
   * @this Dice
   * @returns {string} the last 16 rolls in [history]{@link Dice.history}
   */
  exec: function() {
    let response = "";
    const history = this.history;
    for( let i = 0; i < history.length; ++i ) {
      response += `**${history[i].playerID}**: ${history[i].type}, result: **${history[i].value}**\n`;
      if( history[i].rolls.length > 1 ) {
        response += `total: **${history[i].total}**; rolled with ${history[i].adv ? "advantage" : "disadvantage"}\n`;
        response += `[ ${history[i].rolls.join(', ')} ]\n`;
      }
    }
    return( response );
  } 

};

/**
 * @name proof
 */
export const proof = {

  help: "here be subcommand options/help?",

  /**
   * @method exec
   * @memberof module:dice.proof
   * @this Dice
   * @returns {string} the extreme dice rolling algorithm
   */
  exec: function() {
    let response = this.roll + "";
    response = response.replaceAll( '`', '\\`' );
    response = "```js\n" + response + "\n```"
    return( response );
  } 

};

/**
 * @typedef {import('discord.js').Message} Message
 * @typedef {import('../struct/Bot').default} Bot
 */

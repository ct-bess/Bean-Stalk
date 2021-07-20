import Subcommand from '../../struct/Subcommand';
/**
 * {@link Dice} subcommands
 * @module dice
 */

export const choose = new Subcommand({

  name: "choose",
  help: "Select 1 option form a list\n`options` or expression: comma or space seperated list of options to choose from",

  /**
   * Select a string from a comma or space seperated list of options
   * @method module:dice~choose
   * @memberof module:dice
   * @this Dice
   * @param {commandArg} args - argument map
   * @param {Message} message - Discord Message orgin
   * @param {Bot} bot - Discord Client
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

});

export const hist = new Subcommand({

  name: "hist",
  help: "print the last 16 rolls and their details",

  /**
   * @method module:dice~hist
   * @memberof module:dice
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

});

/**
 * @name proof
 */
export const proof = new Subcommand({

  name: "proof",
  help: "attatch the expertly crafted dice rolling algorithm",

  /**
   * @method module:dice~proof
   * @memberof module:dice
   * @this Dice
   * @returns {string} the extreme dice rolling algorithm
   */
  exec: function() {
    let response = this.roll + "";
    response = response.replaceAll( '`', '\\`' );
    response = "```js\n" + response + "\n```"
    return( response );
  } 

});

/**
 * @typedef {import('discord.js').Message} Message
 * @typedef {import('../struct/Bot').default} Bot
 */

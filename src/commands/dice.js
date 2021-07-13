import Command from "../struct/Command";

/**
 * This command rolls dice, perfect for virtual DnD
 * 
 * **Subcommands:**
 * - `hist` and `history`: print the last 16 or so rolls
 * - `proof` and `bread`: attach dice rolling algorithm
 * - `(number)`: roll a dice of the specified number
 * 
 * **Options:**
 * - `count` var: A number of how many dice to roll; Negative implies a *roll with disadvantage* and vise versa
 * 
 */
class Dice extends Command {

  constructor(
    name = "dice",
    description = "Roll a dice",
    aliases = [ "d", "roll" ]
  ) {
    super( name, description, aliases );
    this.history = [];
  }

  /**
   * @param {import('discord.js').Message} message
   * @param {import('../struct/Bot').default} bot
   */
  exec = ( message, bot ) => {

    const args = this.getArgs( message );
    let response = "";

    // ok this looks gross
    // also why did i choose to use this.history.value and d.val ???

    switch( args.get( 0 ) ) {
      case "hist":
      case "history":
        for( let i = 0; i < this.history.length; ++i ) {
          response += `**${this.history[i].playerID}**: ${this.history[i].type}, result: **${this.history[i].value}**\n`;
          if( this.history[i].rolls.length > 1 ) {
            response += `total: **${this.history[i].total}**; rolled with ${this.history[i].adv ? "advantage" : "disadvantage"}\n`;
            response += `[ ${this.history[i].rolls.join(', ')} ]\n`;
          }
        }
        break;
      case "proof":
      case "bread":
        response = {
          files: [{
            attachment: "./lib/commands/dice.js",
            name: "dice.js"
          }]
        };
        break;
      case "choose":
        let options = args.get( "options" ) || args.get( 1 );
        if( /,/g.test( options ) ) {
          options = options.split( "," );
        }
        else options = options.split( " " );
        const selected = ( this.roll( options.length, 1, 1, message.author ) ).val - 1;
        this.history[ this.history.length - 1 ].value += ` (${options[selected]})`;
        const randEmoji = bot.emojis.cache.random();
        if( args.has( "quiet" ) ) response = options[selected];
        else response = `**${options[selected]}** <:${randEmoji.name}:${randEmoji.id}> <@!${message.author.id}>`;
        break;
      default:
        const max = parseInt( args.get( 0 ) );
        const count = parseInt( args.get( "count" ) || args.get( 1 ) );
        const min = 1;
        const roll = this.roll( max, min, count, message.author );
        const emoji = roll.val == max ? bot.var.emojis.solaire : ( roll.val == min ? ":alien:" : ":hotsprings:" );
        response = `**${roll.val}** ${emoji} <@!${message.author.id}>`;
        if( Math.abs( count ) > 1 ) {
          response += `\n${roll.adv ? "" : "*rolled with disadvantage*; "}roll sum: **${roll.tot}**\n`;
          response += `[ ${roll.rolls.join(', ')} ]`;
        }
    }

    if( response.length > 2000 ) super.sendBulk( response, message );
    else message.send( response );

  }

  roll = ( max, min, count, author ) => {
    
    console.debug( "rolling dice ..." );

    let d = {
      val: 0,
      tot: 0,
      rolls: [],
      adv: count > 0
    };
    if( max == 0 || min == 0 ) {
      console.info( "Invalid max for roll:", max, "Or min:", min );
      d.val = "bruH";
    }

    else if( !count || Math.abs( count ) === 1 || !parseInt( count ) ) {
      d.val = Math.floor( Math.random() * ( max - 0 ) ) + min;
      d.tot = d.val;
      d.rolls.push( d.val );
    }

    else if( count > 0xfffff ) {
      d.val = `Chill with that ${count} rolls`;
      console.info( "aborting dice called with count:", count );
    }

    else {
      console.debug( "rolling multiple dice for count:", count );
      for( let i = 0; i < Math.abs( count ); ++i ) {
        const roll = Math.floor( Math.random() * ( max - 0 ) ) + min;
        d.tot += roll;
        d.rolls.push( roll );
        d.val = 
          ((d.adv)  + 0)*(((( roll > d.val ) + 0 ) * roll ) + ((( roll <= d.val ) + 0 ) * d.val )) +
          ((!d.adv) + 0)*(((( roll < d.val ) + 0 ) * roll ) + ((( roll >= d.val ) + 0 ) * d.val )) +
          ((!d.adv) + 0)*(( i === 0 ) + 0) * roll; // d.val is initialized as 0; So initialize it to roll in disadv
      }
    }

    this.history.push({
      playerID: author.username,
      type: `d${max} x${count || 1}`,
      value: d.val,
      rolls: d.rolls,
      total: d.tot,
      adv: d.adv
    });
    if( this.history.length > 16 ) this.history.shift();

    console.info( "dice result:", d );

    return( d );

  }

}

export default new Dice();

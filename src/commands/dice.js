import Command from "../struct/Command";
import CommandOptions from "../../slashCommands/dice.json";

/**
 * awesome dice
 */
class Dice extends Command {

  constructor() {
    super( CommandOptions );
    this.history = [];
  }

  /**
   * fetch the history
   */
  get_history = () => {
    let response = "";
    if( this.history.length > 0 ) {
      for( const roll of this.history ) {
        response += `${roll.user}: **${roll.value}** from ${roll.type}\n`;
        if( roll.rolls.length > 1 ) {
          response += `\ttotal: ${roll.total}\n\trolls: ${roll.rolls.join(', ')}\n`;
        }
      }
    }
    else {
      response = "ain't got no rolls :flushed:";
    }
    return({ method: "reply", payload: response });
  }

  /**
   * roll the dice with a given count and/or size
   * @param {CommandInteraction} interaction - The command interaction
   */
  roll = ( interaction ) => {

    let count = parseInt( interaction.options.getString( "count" ) ) || 1;
    let max = parseInt( interaction.options.getString( "size" ) ) || 20;
    max = Math.abs( max );
    const min = 1;

    let d = {
      val: 0,
      tot: 0,
      rolls: [],
      adv: count > 0
    };

    count = Math.abs( count );

    if( max == 0 || min == 0 ) {
      console.info( "Invalid max for roll:", max, "Or min:", min );
      d.val = "bruH";
    }

    else if( count === 1 ) {
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
      user: interaction.user.username,
      type: `d${max} x ` + ( d.adv ? "+" : "-" ) + count,
      value: d.val,
      rolls: d.rolls,
      total: d.tot
    });
    if( this.history.length > 16 ) this.history.shift();

    console.info( "dice result:", d );

    let response = "";

    const emoji = d.val == max ? ":flushed:" : ( d.val == min ? ":alien:" : ":hotsprings:" );
    response = `**${d.val}** ${emoji} ${this.history[ this.history.length - 1 ]}`;

    if( count > 1 ) {
      response += `\nsum: **${d.tot}**`;
      response += "\n[ " + d.rolls.join(', ') + " ]";
    }

    return({ method: "reply", payload: response });

  }

};

export default new Dice();

/**
 * @typedef {import('discord.js').CommandInteraction} CommandInteraction
 */
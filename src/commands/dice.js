import { sendBulk } from "../sendBulk.js";

export default {
  name: "dice",
  aliases: [ "d", "roll" ],
  description: "Roll a dice",
  history: [{ 
    playerID: "LITERALLY WHO :sweat_drops:",
    type: "ROLLED WHAT :sweat_drops:",
    value: "ROLL VALUE :sweat_drops:"
  }],
  roll( max, min, count, author ) {
    
    console.debug( "[ entering roll() ]" );

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
      console.info( "Invalid count or no count:", count );
      d.val = Math.floor( Math.random() * ( max - 0 ) ) + min;
      d.tot = d.val;
      d.rolls.push( d.val );
    }

    else if( count > 0xfffff ) {
      d.val = `Chill with that ${count} rolls`;
    }

    else {
      console.info( "valid count:", count );
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
      rolls: d.rolls.join(','),
      total: d.tot,
      adv: d.adv
    });
    if( this.history.length > 16 ) this.history.shift();

    console.debug( "[ exiting roll() ]" );

    return( d );

  },
  exec( message, bot ) {
    const args = message.content.slice( 1 ).split( /\s+/ );
    args.shift();
    const subCommand = args[0].toLowerCase() || "lma0";
    let response = "";
    switch( subCommand ) {
      case "hist":
      case "history":
        for( let i = 0; i < this.history.length; ++i ) {
          response += `**${this.history[i].playerID}**: ${this.history[i].type}, result: **${this.history[i].value}**\n`;
          if( this.history[i].rolls.length > 1 ) {
            response += `total: **${this.history[i].total}**; rolled with ${this.history[i].adv ? "advantage" : "disadvantage"}\n`;
            response += `[ ${this.history[i].rolls} ]\n`;
          }
        }
        break;
      case "proof":
      case "bread":
        message.channel.send({
          files: [{
            attachment: "./lib/commands/dice.js",
            name: "dice.js"
          }]
        });
        return;
      default:
        const max = parseInt( args[0] );
        const count = parseInt( args[1] );
        const min = 1;
        const roll = this.roll( max, min, count, message.author );
        const emoji = roll.val == max ? bot.var.emojis.solaire : ( roll.val == min ? ":alien:" : ":hotsprings:" );
        response = `**${roll.val}** ${emoji} <@!${message.author.id}>`;
        if( Math.abs( count ) > 1 ) {
          response += `\n${roll.adv ? "" : "*rolled with disadvantage*; "}roll sum: **${roll.tot}**\n`;
          response += `[ ${roll.rolls.join(', ')} ]`;
        }
    }

    if( response.length > 2000 ) sendBulk( response, message, null );
    else message.channel.send( response );

  }

};

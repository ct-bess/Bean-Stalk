//import { execSync } from "child_process"

export default {
  name: "dice",
  aliases: [ "d", "roll" ],
  description: "Roll a dice",
  options: [
    "<dice size> <?rolls>\tRoll a X sided dice. Optional roll count that picks the highest of the rolls; Defaults to 1 roll",
    "`hist`\tPrints a history of the last 16 rolls",
    "`proof`\tAttach a copy of the dice rolling algorithm to the channel"
  ],
  examples: [ 
    "`dice 2`\tRoll a 2 sided dice", 
    "`d 20 2`\tRoll a 20 sided dice twice", 
    "`roll 0xf 0b11`\tRoll a 15 sided dice 3 times", 
    "`d hist`" 
  ],
  history: [{ 
    playerID: "LITERALLY WHO :sweat_drops:",
    type: "ROLLED WHAT :sweat_drops:",
    value: "ROLL VALUE :sweat_drops:"
  }],
  roll( max, min, count, author ) {

    let diceValue = 0;
    if( max == 0 ) {
      diceValue = "bruH";
    }

    else if( !count || count === 1 || /\D/.test( count ) ) {
      diceValue = Math.floor( Math.random() * ( max - 0 ) ) + min;
    }

    // -- Rolling with advantage? pick the highest of the times rolled
    else {
      for( let i = 0; i < count; ++i ) {
        const roll = Math.floor( Math.random() * ( max - 0 ) ) + min;
        diceValue = diceValue > roll ? diceValue : roll;
      }
    }

    this.history.push({
      playerID: author.username, //.username for no @
      type: `d${max} x${count || 1}`,
      value: diceValue
    });
    if( this.history.length > 16 ) this.history.shift();

    return( diceValue );

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
        }
        message.channel.send( response );
        break;
      case "proof":
      case "bread":
        message.channel.send({
          files: [{
            attachment: "./lib/commands/dice.js",
            name: "dice.js"
          }]
        });
        break;
      default:
        const max = parseInt( args[0] );
        const count = parseInt( args[1] );
        const min = 1;
        response = this.roll( max, min, count, message.author );
        message.channel.send( `**${response}** :hotsprings: ${message.author}` );
    }

  }

};

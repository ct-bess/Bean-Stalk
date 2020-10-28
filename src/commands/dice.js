//import { execSync } from "child_process"

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

    let diceValue = 0;
    if( max == 0 || min == 0 ) {
      console.info( "Invalid max for roll:", max, "Or min:", min );
      diceValue = "bruH";
    }

    else if( !count || Math.abs( count ) === 1 || !parseInt( count ) ) {
      console.info( "Invalid count or no count:", count );
      diceValue = Math.floor( Math.random() * ( max - 0 ) ) + min;
    }

    else if( count > 0xfffff ) {
      diceValue = `Chill with that ${count} rolls`;
    }

    else {
      console.info( "valid count:", count );
      let rolls = [];
      for( let i = 0; i < Math.abs( count ); ++i ) {
        const roll = Math.floor( Math.random() * ( max - 0 ) ) + min;
        rolls.push( roll );
        diceValue = 
          ((count > 0) + 0)*(((( roll > diceValue ) + 0 ) * roll ) +  ((( roll <= diceValue ) + 0 ) * diceValue ))+
          ((count < 0) + 0)*(((( roll < diceValue ) + 0 ) * roll ) +  ((( roll >= diceValue ) + 0 ) * diceValue ))+
          ((count < 0) + 0)*(( i === 0 ) + 0)*roll; // diceValue is initialized as 0; So initialize it to roll in disadv
      }
      console.debug( "rolls:", rolls );
    }

    this.history.push({
      playerID: author.username, //.username for no @
      type: `d${max} x${count || 1}`,
      value: diceValue
    });
    if( this.history.length > 16 ) this.history.shift();

    console.debug( "Roll Value:", diceValue );
    console.debug( "[ exiting roll() ]" );

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

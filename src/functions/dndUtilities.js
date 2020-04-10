class dndUtilities {

  constructor() {

    this.rollHistory = [{
      playerID: "BEAN :sweat_drops:",
      type: "d4 2",
      value: "3"
    }];

  }

  exec( command, message ) {

    let response = "";
    let input = null;

    switch( command ) {

      case "roll":
        //const input = message.content.split( /(?<=d)?\s/ );
        input = message.content.replace( /d/, "" );
        input = input.split( /\s/ );
        const rollVal = this.roll( input[0], input[1] || 1 );
        console.log( `rolls: ${input[0]} x${input[1] || 1}` );
        this.rollHistory.push({
          playerID: message.user,
          type: `d${input[0]} x${input[1] || 1}`,
          value: rollVal
        });
        response = `**${rollVal}** :hotsprings: ${message.user} `;
        if( this.rollHistory.length > 16 ) this.rollHistory.shift();
      break;

      case "rollHistory":
        for( let i = 0; i < this.rollHistory.length; ++i ) {
          response += `${this.rollHistory[i].playerID}: ${this.rollHistory[i].type}, result: **${this.rollHistory[i].value}**\n`;
        }
      break;

      default:
        response = "```diff\nLMAO\n```";
    }

    return( response );

  }

  roll( dice, count ) {

    const max = dice;
    const min = 1;
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

    return( diceValue );

  }

}

export default dndUtilities;

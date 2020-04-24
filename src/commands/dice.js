export default {
  name: "dice",
  description: "ROLL a dice! `-d <number> <?times>`\ne.g. `-d 20`, `-d12 2`, `-d0xc0c`, `-d0b11 0x3`",
  aliases: [ "d", "roll" ],
  history: [{ 
    playerID: ":sweat_drops:",
    type: ":sweat_drops:",
    value: ":sweat_drops:"
  }],
  exec( message, args ) {

    if( /hist/i.test( args[0] ) ) {
      let response = "";
      for( let i = 0; i < this.history.length; ++i ) {
        response += `${this.history[i].playerID}: ${this.history[i].type}, result: **${this.history[i].value}**\n`;
      }
      message.channel.send( response );
      return;
    }

    const max = args[0];
    const count = args[1];
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

    this.history.push({
      playerID: message.author, //.username for no @
      type: `d${max} x${count || 1}`,
      value: diceValue
    });
    if( this.history.length > 16 ) this.history.shift();

    message.channel.send( `**${diceValue}** :hotsprings: ${message.author}` );
    return;

  }

};

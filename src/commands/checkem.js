export default {
  name: "checkem",
  description: "Get your message time-stamp",
  aliases: [ "eric" ],
  options: [ "`rand`\tUses 9 random digits rather than your message timestamp" ],
  examples: [ "`checkem`", "`checkem rand`" ],
  exec( message, bot ) {
    const args = message.content.slice( 1 ).split( /\s+/ );
    args.shift();
    
    // Use message.createdTimeStamp as a seed or somethin
    let response = "";
    if( args[0] === "rand" ) {

      const max = 9;
      const min = 1;

      for( let i = 0; i < 9; ++i ) {
        response += Math.floor( Math.random() * ( max - 0 ) ) + min;
      }

    }
    else {
      response = message.createdTimestamp + "";
    }

    if( /(\d)\1\1\1$/.test( response ) ) {
      response += " **QUAAAAAAAAAAAAAAAD** :wind_chime:";
    }
    else if( /(\d)\1\1$/.test( response ) ) {
      response += " **TRIPS** :fire:";
    }
    else if( /(\d)\1$/.test( response ) ) {
      response += " **DUBS** :hotsprings:";
    }

    message.channel.send( `${response} :sweat_drops: ${message.author}` );
    return;

  }

};

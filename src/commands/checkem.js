export default {
  name: "checkem",
  description: "Get your message time-stamp `checkem <?r|rand>`\nUses your message time stamp by default. Use random option for something random.",
  aliases: [ "eric" ],
  exec( message, args ) {
    
    // Use message.createdTimeStamp as a seed or somethin
    let response = "";
    if( /r(and)?/i.test( args[0] ) ) {

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

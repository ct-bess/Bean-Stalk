import { argHandler } from "../util/commandUtil";

export default {
  name: "checkem",
  description: "Get your message time-stamp",
  aliases: [ "eric" ],
  exec( message, bot ) {
    const args = argHandler( message );
    
    // Use message.createdTimeStamp as a seed or somethin
    let response = "";
    if( args.has( "rand" ) || args.has( "r" ) ) {

      const max = 9;
      const min = 1;

      for( let i = 0; i < 9; ++i ) {
        response += Math.floor( Math.random() * ( max - 0 ) ) + min;
      }

    }
    else if( args.has( "cheat" ) ) {
      response = args.get( "cheat" )
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

    message.channel.send( `${response} :sweat_drops: <@!${message.author.id}>` );
    return;

  }

};

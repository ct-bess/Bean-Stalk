import Command from "../struct/Command";

/**
 * This command prints your message's timestamp to the text channel
 * The excitement of the response is dependent on how many numbers match in a row
 * 
 * **Options:**
 * - `rand` flag: use 9 random numbers instead of your message's timestamp
 * - `cheat` var: uses the supplied string as your timestamp
 */
class Checkem extends Command {

  constructor(
    name = "checkem",
    description = "Get your message timestamp",
    aliases = [ "eric" ]
  ) {
    super( name, description, aliases );
  }

  /**
   * @param {import('discord.js').Message} message
   * @param {import('../struct/Bot').default} bot
   */
  exec = ( message, bot ) => {

    const args = this.getArgs( message );
    
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

  }

}

export default new Checkem();

import Command from "../struct/Command";

/**
 * This command sends a specified message or the previous message to a text channel.
 * Will not send a message over 2000 characters.
 * Calling as `echo` defaults to sending the message to the current channel.
 * Calling as `yeet` defaults to sending to a random text channel.
 * 
 * **Options:**
 * - `channel` var: the text channel to send to
 * - `delay` var: how long to wait in milliseconds before sending
 * @extends Command
 */
class Echo extends Command {

  constructor(
    name = "echo",
    description = "echos or yeets the given or not given text",
    aliases = [ "yeet" ]
  ) {
    super( name, description, aliases );
  }

  /**
   * @param {Message} message
   * @param {Bot} bot
   */
  exec = ( message, bot ) => {

    const args = this.getArgs( message );

    /** @type {import('discord.js').GuildChannel} */
    let channel = null;

    // wow brillinat
    if( args.get( -1 ) === this.aliases[0] ) channel = bot.channels.cache.random();
    else channel = message.channel;

    const delay = ( parseInt( args.get( "delay" ) ) || 0 ) * 1000;

    if( args.has( "channel" ) ) {
      channel = args.get( "channel" );
      channel = this.coalesce( channel, "channel", bot, null );
    }

    const perm = channel.permissionsFor( bot.user.id );

    if( !!channel || !perm.has( "SEND_MESSAGES" ) ) {
      try {

        // disgusting

        let m = "", iterations = 0;
        let validChannel = channel.isText() && perm.has( "SEND_MESSAGES" );

        // called with no message --> pull message before command
        if( !args.has( 0 ) ) {
          m = message.channel.messages.cache.last( 2 )[0].content;
        }

        // STAND ASIDE AND LET A REAL ENGINEER HANDLE IT (one of the consequences of the arg system)
        else if( args.has( 0 ) && !args.has( 1 ) ) {
          m = args.get( 0 );
        }
        else {
          m = args.get( 0 ) + " " + args.get( 1 );
        }

        while( !validChannel && iterations < 69 ) {
          channel = bot.channels.cache.random();
          validChannel = channel.isText() && perm.has( "SEND_MESSAGES" );
          ++iterations;
        }

        if( validChannel && m.length > 0 && m.length < 2000 ) {
          if( delay > 0 ) {
            console.debug( "echoing/sending message after", delay, "ms" );
            setTimeout( () => { 

              // DYNAMIC GAMEPLAY
              if( !args.has( 0 ) ) {
                m = message.channel.messages.cache.last( 2 )[0].content;
              }
              channel.send( m || "bruh" ) 

            }, delay );
          }
          else {
            channel.send( m );
          }
        } // EO valid channel check

      } catch( error ) {
        console.error( "echo command failed:", error );
      }

    }
    else {
      message.reply( "aint got no channel" );
    }
  }

}

export default new Echo();

/**
 * @typedef {import('discord.js').Message} Message
 * @typedef {import('../struct/Bot').default} Bot
 */

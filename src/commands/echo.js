import { argHandler, coalesce } from "../util/commandUtil";

export default {
  name: "echo",
  aliases: [ "yeet" ],
  description: "echos or yeets the given or not given text",
  exec( message, bot ) {

    const args = argHandler( message );
    let channel = null;

    // wow brillinat
    if( args.get( -1 ) === this.aliases[0] ) channel = bot.channels.cache.random();
    else channel = message.channel;

    const delay = ( parseInt( args.get( "delay" ) ) || 0 ) * 1000;

    if( args.has( "channel" ) ) {
      channel = args.get( "channel" );
      channel = coalesce( channel, "channel", bot, null );
    }

    const perm = channel.permissionsFor( bot.user.id );

    if( !!channel || !perm.has( "SEND_MESSAGES" ) ) {
      try {

        // disgusting

        let m = "", iterations = 0;
        let validChannel = channel.isText() && perm.has( "SEND_MESSAGES" );

        // called with no message to echo
        if( !args.has( 0 ) ) m = message.channel.messages.cache.last( 2 )[0].content;
        // STAND ASIDE AND LET A REAL ENGINEER HANDLE IT
        else if( args.has( 0 ) && !args.has( 1 ) ) m = args.get( 0 );
        else m = args.get( 0 ) + " " + args.get( 1 );
        // this will attach flags and variables to the echo response
        //else m = message.content.slice( bot.var.config.prefix.length + args.get( -1 ).length );

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
              if( !args.has( 0 ) ) m = message.channel.messages.cache.last( 2 )[0].content;
              channel.send( m || "bruh" ) 
            }, delay );
          }
          else channel.send( m );
        }

      } catch( error ) {
        console.error( "echo failed:", error );
      }

    }
    else {
      message.reply( "aint got no channel" );
    }

  } // EO exec
};

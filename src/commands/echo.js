import { argHandler, coalesce } from "../commandUtil.js";

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

    let delay = args.get( "delay" ) || 0;
    delay = parseInt( delay ) * 1000;

    if( args.has( "channel" ) ) {
      channel = args.get( "channel" );
      channel = coalesce( channel, "channel", bot, null );
    }

    if( !!channel ) {
      try {

        let m = "", iterations = 0;
        const perm = channel.permissionsFor( bot.user.id );
        let validChannel = channel.isText() && perm.has( "SEND_MESSAGES" );

        if( !args.has( 0 ) ) m = message.channel.messages.cache.last( 2 )[0].content;
        // cool
        else m = message.content.slice( bot.var.config.prefix.length + args.get( -1 ).length );

        while( !validChannel && iterations < 69 ) {
          channel = bot.channels.cache.random();
          validChannel = channel.isText() && perm.has( "SEND_MESSAGES" );
          ++iterations;
        }

        if( validChannel && m.length > 0 && m.length < 2000 ) {
          if( delay > 0 ) {
            setTimeout( () => { 
              // DYNAMIC GAMEPLAY
              if( !args.has( 0 ) ) m = message.channel.messages.cache.last( 2 )[0].content;
              channel.send( m || "bruh" ) 
            }, delay );
          }
          else channel.send( m );
        }

      } catch( error ) {
        console.error( error );
      }

    }
    else {
      message.reply( "aint got no channel" );
    }

  } // EO exec
};

